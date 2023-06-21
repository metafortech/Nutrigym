const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiErr = require("../utils/apiError");
const generateToken = require("../utils/createToken");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
var FCM = require("fcm-node");
const Factory = require("./handlerFactory");

const Club = require("../models/clubModel");
const Clinic = require("../models/clinicModel");
const Phyclinic = require("../models/phyiscalclinicModel");

const User = require("../models/userModel");

const admin = require("firebase-admin");

async function getAllDeviceTokens() {
  try {
    const users = await User.find();
    const tokens = users.map((user) => user.deviceToken);
    return tokens;
  } catch (error) {
    console.error("Error fetching device tokens:", error);
    throw error;
  }
}

async function getDeviceTokenForUser(userId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }
    return user.deviceToken;
  } catch (error) {
    console.error("Error fetching device token for user:", error);
    throw error;
  }
}


const serviceAccount = require("../config/push-notification-key.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  createUser: Factory.createOne(User),
  getUsers: Factory.getAll(User),
  getUser: Factory.getOnebyId(User, "User", "subscibtions"),
  updateUser: asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      },
      {
        new: true,
      }
    );
    if (!document) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    res.status(200).json({ data: document });
  }),
  updateUserPassword: asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    if (!document) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    res.status(200).json({ data: document });
  }),
  deleteUser: Factory.deleteOne(User, "User"),
  getLoggedUserData: asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
  }),
  updateLoggedUserPassword: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    if (!user) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    const token = generateToken(user._id);
    user.deviceToken = token;
    await user.save();

    res.status(200).json({ data: user, token });
  }),
  updateLoggedUserData: asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Data Updated Succesfully", data: updatedUser });
  }),
  addManagerToClub: asyncHandler(async (req, res, next) => {
    const { clubId, managerId } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Invalid manager" });
    }

    club.manager = managerId;
    await club.save();
    manager.clubManage.push(club._id);
    await manager.save();

    res.status(200).json({ message: "Manager added successfully" });
  }),
  addManagerToClinic: asyncHandler(async (req, res, next) => {
    const { clinicId, managerId } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Invalid manager" });
    }

    clinic.manager = managerId;
    await clinic.save();
    manager.clinicManage.push(clinic._id);
    await manager.save();

    res.status(200).json({ message: "Manager added successfully" });
  }),
  removeManagerFromClinic: asyncHandler(async (req, res, next) => {
    const { clinicId, managerId } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    clinic.manager = null;
    await clinic.save();

    res.status(200).json({ message: "Manager removed successfully" });
  }),
  addManagerToPhyclinic: asyncHandler(async (req, res, next) => {
    const { phyClinicId, managerId } = req.body;

    const phyClinic = await Phyclinic.findById(phyClinicId);
    if (!phyClinic) {
      return res.status(404).json({ message: "PhyClinic not found" });
    }

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Invalid manager" });
    }

    phyClinic.manager = managerId;
    await phyClinic.save();
    manager.phyClinicManage.push(phyClinic._id);
    await manager.save();

    res.status(200).json({ message: "Manager added successfully" });
  }),
  sendNotificationToAllUsers: asyncHandler(async (req, res, next) => {
   const SERVER_KEY = "AAAAaBC5ZYg:APA91bHxB0BdbkYQhugxZSM_NksbN2VK2PPLfFY9HcyiywpKYmsVaKU1K9VKSb3cQNxUzL5g8o0hFIFRZ9-nggKP5kL8tN-gCNEqn8iM0jPsE2SASzJj4CSVI2JVro5VdO0m6gJM2t8z"
    let fcm = new FCM(SERVER_KEY);
    const { title, body } = req.body;
    const tokens = await getAllDeviceTokens(); // Implement your logic to fetch device tokens from the database
    const message = {
      to: "/topics/" + req.body.topic,
      notification: {
        title: title,
        body: body,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
      tokens,
    };
    fcm.send(message, (err, response) => {
      if (err) {
        next(err);
      } else {
        res.json({ message: "Notification sent to all users.", response });
      }
    });

  
  }),
  sendNotificationToUser: asyncHandler(async (req, res, next) => {
   const SERVER_KEY = "AAAAaBC5ZYg:APA91bHxB0BdbkYQhugxZSM_NksbN2VK2PPLfFY9HcyiywpKYmsVaKU1K9VKSb3cQNxUzL5g8o0hFIFRZ9-nggKP5kL8tN-gCNEqn8iM0jPsE2SASzJj4CSVI2JVro5VdO0m6gJM2t8z"
    let fcm = new FCM(SERVER_KEY);
    const { userId } = req.params;
    const { title, body } = req.body;
    const token = await getDeviceTokenForUser(userId);
    const message = {
      to: "/topics/" + req.body.topic,
      notification: {
        title: title,
        body: body,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
      token,
    };
    fcm.send(message, (err, response) => {
      if (err) {
        next(err);
      } else {
        res.json({ message: "Notification sent to this user.", response });
      }
    });

 
  }),
};
