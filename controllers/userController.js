const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiErr = require("../utils/apiError");
const generateToken = require("../utils/createToken");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Factory = require("./handlerFactory");
const Club = require("../models/clubModel");
const Clinic = require("../models/clinicModel");
const Phyclinic = require("../models/phyiscalclinicModel");

const User = require("../models/userModel");

///////////////////////////////////////////////////////

module.exports = {
  createUser: Factory.createOne(User),
  //@desc     create User
  //route     POST /api/v1/Users
  //access    private

  getUsers: Factory.getAll(User),
  //@desc     get list of User
  //route     GET /api/v1/Users
  //access    private

  getUser: Factory.getOnebyId(User, "User", "subscibtions"),

  //@desc     get specific User by id
  //route     GET /api/v1/Users/:id
  //access    private

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
  //@desc    update specific User by id
  //route     PUT /api/v1/Users/:id
  //access    private

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
  //@desc    update specific UserPassword by id
  //route     PUT /api/v1/Users/:id
  //access    private

  deleteUser: Factory.deleteOne(User, "User"),
  //@desc    delete specific User by id
  //route     DELETE /api/v1/Users/:id
  //access    private

  getLoggedUserData: asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
  }),
  //@desc     get logged user data
  //route     GET /api/v1/Users/getMyData
  //access    private/protect

  updateLoggedUserPassword: asyncHandler(async (req, res, next) => {
    //1)update logged user passwored based on payload(user._id) from protect route
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

    //2) generate token
    const token = generateToken(user._id);

    res.status(200).json({ data: user, token });
  }),
  //@desc    update specific loggedUserPassword by id  user_id
  //route     PUT /api/v1/Users/updateMyPassword
  //access    private/Protect
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
  //@desc    update specific LoggedUserData by id   user_id  (without password , role)
  //route     PUT /api/v1/Users/updateMyData
  //access    private/Protect
  addManagerToClub: asyncHandler(async (req, res, next) => {
    const { clubId, managerId } = req.body;

    // Check if the club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the user exists and has the "manager" role
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

    // Check if the clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check if the user exists and has the "manager" role
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

    // Check if the clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check if the user exists and has the "manager" role
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Invalid manager" });
    }

    clinic.manager = managerId;
    await clinic.save();

    res.status(200).json({ message: "Manager added successfully" });
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
};
