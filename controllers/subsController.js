const Club = require("../models/clubModel");
const Subs = require("../models/subsModel");
const User = require("../models/userModel");
const Clinic = require("../models/clinicModel");
const PhyClinic = require("../models/phyiscalclinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

/////////////////////////////////////////////////////

module.exports = {
  createSubForClinic: asyncHandler(async (req, res, next) => {
    const { dateOfEnd, dateOfStart, title, description, clinicId } = req.body;
    const user = await User.findOne(req.user._id);
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "no Clinic with thid id" });
    }

    const newSub = new Subs({
      title,
      description,
      subscriber: user._id,
      clinic: clinicId,
      dateOfStart,
      dateOfEnd,
    });
    await newSub.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { subscibtions: newSub._id },
    });

    await Clinic.findByIdAndUpdate(clinicId, {
      $push: { subscribes: newSub._id },
    });
    res.status(201).json({ message: "Done", newSub });
  }),
  subforClinicService: asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await Clinic.findOne({ "services._id": serviceId });
    // Check if the service exists
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    // Check if the user is already subscribed to the service
    if (service.services[0].subscribes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "User already subscribed to this service" });
    }
    // Find the user by id and update the subscibtions field
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subscibtions: serviceId } },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the service's subscribes field
    service.services[0].subscribes.push(req.user._id);
    await service.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User subscribed to the service successfully" });
  }),
  getmyClinicServicesSub: asyncHandler(async (req, res, next) => {
    const myservices = await Clinic.find({
      "services.subscribes": req.user._id,
    }).select("name description services.$");
    res.status(200).json({ myservices });
  }),
  /////////////////////////////////////////phyclinic///////////////////////////////////////////////////////////
  createSubForPhyClinic: asyncHandler(async (req, res, next) => {
    const { dateOfEnd, dateOfStart, title, description, phyClinicId } =
      req.body;
    const user = await User.findOne(req.user._id);
    const phyClinic = await PhyClinic.findById(phyClinicId);
    if (!phyClinic) {
      return res.status(404).json({ message: "no phyClinic with thid id" });
    }

    const newSub = new Subs({
      title,
      description,
      subscriber: user._id,
      phyclinic: phyClinic._id,
      dateOfStart,
      dateOfEnd,
    });
    await newSub.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { subscibtions: newSub._id },
    });

    await PhyClinic.findByIdAndUpdate(phyClinic._id, {
      $push: { subscribes: newSub._id },
    });
    res.status(201).json({ message: "Done", newSub });
  }),
  subforPhyService: asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await PhyClinic.findOne({ "services._id": serviceId });
    // Check if the service exists
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    // Check if the user is already subscribed to the service
    if (service.services[0].subscribes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "User already subscribed to this service" });
    }
    // Find the user by id and update the subscibtions field
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subscibtions: serviceId } },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the service's subscribes field
    service.services[0].subscribes.push(req.user._id);
    await service.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User subscribed to the service successfully" });
  }),
  getmyPhyservicesSub: asyncHandler(async (req, res, next) => {
    const myservices = await PhyClinic.find({
      "services.subscribes": req.user._id,
    }).select("name description services.$");
    res.status(200).json({ myservices });
  }),

  ////////////////////////////////////club///////////////////////////////////////////
  createSubForClub: asyncHandler(async (req, res, next) => {
    const { dateOfEnd, dateOfStart, title, description, clubId } = req.body;
    const user = await User.findOne(req.user._id);
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "no club with thid id" });
    }

    const newSub = new Subs({
      title,
      description,
      subscriber: user._id,
      club: clubId,
      dateOfStart,
      dateOfEnd,
    });
    await newSub.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { subscibtions: newSub._id },
    });

    await Club.findByIdAndUpdate(club._id, {
      $push: { subscribes: newSub._id },
    });
    res.status(201).json({ message: "Done", newSub });
  }),
  cancelSubForClub: asyncHandler(async (req, res, next) => {
    const { subId } = req.params;
    const user = await User.findOne(req.user._id);

    const subscription = await Subs.findById(subId);

    // Check if the subscription exists
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Check if the user is the subscriber of the subscription
    if (subscription.subscriber.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Remove the subscription ID from user's subscriptions array
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscibtions: subId },
    });

    // Remove the subscription ID from club's subscribes array
    await Club.findByIdAndUpdate(subscription.club, {
      $pull: { subscribes: subId },
    });

    // Delete the subscription
    await Subs.findByIdAndDelete(subId);

    res.status(200).json({ message: "Subscription canceled successfully" });
  }),

  subforOffer: asyncHandler(async (req, res, next) => {
    const { offerId } = req.params;
    const offer = await Club.findOne({ "offers._id": offerId });
    // Check if the offer exists
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    // Check if the user is already subscribed to the offer
    if (offer.offers[0].subscribes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "User already subscribed to this offer" });
    }
    // Find the user by id and update the subscibtions field
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subscibtions: offerId } },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the offer's subscribes field
    offer.offers[0].subscribes.push(req.user._id);
    await offer.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User subscribed to the offer successfully" });
  }),
  getmyoffersSub: asyncHandler(async (req, res, next) => {
    const myOffers = await Club.find({
      "offers.subscribes": req.user._id,
    }).select("name description offers.$");
    res.status(200).json({ myOffers });
  }),
  getSubs: asyncHandler(async (req, res, next) => {
    const subs = await Subs.find()
      .populate("club", "name")
      .populate("subscriber", "name email")
      .populate("clinic", "name")
      .populate("phyclinic", "name");
    res.status(201).json({ data: subs });
  }),
  getMySubs: asyncHandler(async (req, res, next) => {
    const user = await User.findOne(req.user._id);
    const subs = await Subs.find({ subscriber: user._id })
      .populate("club", "name")
      .populate("clinic", "name")
      .populate("phyclinic", "name");
    res.status(201).json({ data: subs });
  }),
};
