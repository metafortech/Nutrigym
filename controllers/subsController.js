const Club = require("../models/clubModel");
const Subs = require("../models/subsModel");
const User = require("../models/userModel");
const Clinic = require("../models/clinicModel");
const PhyClinic = require("../models/phyiscalclinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/createToken");

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
  cancelSubForClinic: asyncHandler(async (req, res, next) => {
    const { subId } = req.params;
    const user = await User.findOne(req.user._id);

    const subscription = await Subs.findById(subId);
    if (!subscription.clinic) {
      return res
        .status(404)
        .json({ message: "no subscription with this id in  clinic" });
    }

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

    // Remove the subscription ID from clinic's subscribes array
    await Clinic.findByIdAndUpdate(subscription.clinic, {
      $pull: { subscribes: subId },
    });

    // Delete the subscription
    await Subs.findByIdAndDelete(subId);

    res.status(200).json({ message: "Subscription canceled successfully" });
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
  cancelSubForClinicService: asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const user = await User.findOne(req.user._id);

    const clinic = await Clinic.findOne({ "services._id": serviceId });

    // Check if the clinic exists
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check if the user is subscribed to the service
    if (!clinic.services[0].subscribes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User is not subscribed to this service" });
    }

    // Remove the service ID from user's subscriptions array
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscibtions: serviceId },
    });

    // Remove the user ID from service's subscribes array
    clinic.services[0].subscribes.pull(user._id);
    await clinic.save();

    res
      .status(200)
      .json({ message: "Service subscription canceled successfully" });
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
  cancelSubForPhyClinic: asyncHandler(async (req, res, next) => {
    const { subId } = req.params;
    const user = await User.findOne(req.user._id);

    const subscription = await Subs.findById(subId);
    if (!subscription.phyclinic) {
      return res
        .status(404)
        .json({ message: "no subscription with this id in physical clinic" });
    }

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

    // Remove the subscription ID from phyclinic's subscribes array
    await PhyClinic.findByIdAndUpdate(subscription.phyclinic, {
      $pull: { subscribes: subId },
    });

    // Delete the subscription
    await Subs.findByIdAndDelete(subId);

    res.status(200).json({ message: "Subscription canceled successfully" });
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
  cancelSubForPhyClinicService: asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const user = await User.findOne(req.user._id);

    const phyclinic = await PhyClinic.findOne({ "services._id": serviceId });

    // Check if the phyclinic exists
    if (!phyclinic) {
      return res.status(404).json({ message: "Physical Clinic not found" });
    }

    // Check if the user is subscribed to the service
    if (!phyclinic.services[0].subscribes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User is not subscribed to this service" });
    }

    // Remove the service ID from user's subscriptions array
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscibtions: serviceId },
    });

    // Remove the user ID from service's subscribes array
    phyclinic.services[0].subscribes.pull(user._id);
    await phyclinic.save();

    res
      .status(200)
      .json({ message: "Service subscription canceled successfully" });
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
    if (!subscription.club) {
      return res
        .status(404)
        .json({ message: "no subscription with this id in club" });
    }

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
  subNewMemberforOffer: asyncHandler(async (req, res, next) => {
    const { offerId, memberId } = req.params;
    const offer = await Club.findOne({ "offers._id": offerId });
    // Check if the offer exists
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    // Check if the user is already subscribed to the offer
    if (offer.offers[0].subscribes.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "User already subscribed to this offer" });
    }
    // Find the user by id and update the subscibtions field
    const user = await User.findByIdAndUpdate(
      memberId,
      { $push: { subscibtions: offerId } },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the offer's subscribes field
    offer.offers[0].subscribes.push(memberId);
    await offer.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User subscribed to the offer successfully" });
  }),
  cancelSubForClubOffer: asyncHandler(async (req, res, next) => {
    const { offerId } = req.params;
    const user = await User.findOne(req.user._id);

    const club = await Club.findOne({ "offers._id": offerId });

    // Check if the club exists
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the user is subscribed to the offer
    if (!club.offers[0].subscribes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User is not subscribed to this offer" });
    }

    // Remove the offer ID from user's subscriptions array
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscibtions: offerId },
    });

    // Remove the user ID from offer's subscribes array
    club.offers[0].subscribes.pull(user._id);
    await club.save();

    res
      .status(200)
      .json({ message: "Offer subscription canceled successfully" });
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
  //////////////////////////////////////////////////////
  getSubsForClub: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Find the subscribers in the club
    const subscribers = await Subs.find({ club: id }).populate(
      "subscriber",
      "name phone"
    );
    return res.status(200).json({ subscribers });
  }),
  //////////////////////////////////////////////////////
  getMySubs: asyncHandler(async (req, res, next) => {
    const user = await User.findOne(req.user._id);
    const subs = await Subs.find({ subscriber: user._id })
      .populate("club", "name")
      .populate("clinic", "name")
      .populate("phyclinic", "name");
    res.status(201).json({ data: subs });
  }),
};
