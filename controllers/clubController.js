const path = require("path");
const Club = require("../models/clubModel");
const Product = require("../models/productModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("../middlewares/uploadImageCloudnary");

/////////////////////////////////////////////////////

module.exports = {
  uploadExerciseImage: uploadSingleImage("image"),
  uploadImgCloud: asyncHandler(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.url;
    next();
  }),
  createClub: asyncHandler(async (req, res, next) => {
    const { name, description, governorate, street } = req.body;
    const club = new Club({
      name,
      description,
      location: { governorate, street },
    });
    await club.save();
    res.status(200).json({ data: club });
  }),
  //@desc     create Club
  //route     POST /api/v1/Clubs
  //access    private

  getClubs: Factory.getAll(
    Club,
    "Club",
    "manager",
    "name email phone",
    "clubProducts"
  ),
  //@desc     get list of Club
  //route     GET /api/v1/Clubs
  //access    public

  getClub: Factory.getOnebyId(Club, "Club"),
  //@desc     get specific Club by id
  //route     GET /api/v1/Clubs/:id
  //access    public
  updateClub: Factory.updateOnebyId(Club, "Club"),
  //@desc    update specific Club by id
  //route     PUT /api/v1/Clubs/:id
  //access    private
  deleteClub: Factory.deleteOne(Club, "Club"),
  //@desc    delete specific Club by id
  //route     DELETE /api/v1/Clubs/:id
  //access    private

  /////////////////+/////////////////////////////////
  addOffers: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, ratings } = req.body;
    const club = await Club.findById(id);
    if (!club) {
      return res.status(400).json({ message: "club not found" });
    }
    club.offers.push({ name, description, price, ratings });
    await club.save();
    res.status(200).json({ data: club });
  }),
  //////////////////////////////////////////////////////////
  getOffers: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    if (!club) {
      return res.status(400).json({ message: "club not found" });
    }
    res.status(200).json({ data: club.offers });
  }),

  // @desc delete specific offer by id
  // route DELETE /api/v1/Clubs/:clubId/offers/:offerId
  // access private
  deleteOffer: asyncHandler(async (req, res, next) => {
    const { clubId, offerId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(400).json({ message: "club not found" });
    }
    const offer = club.offers.id(offerId);
    if (!offer) {
      return res.status(400).json({ message: "offer not found" });
    }
    offer.remove();
    await club.save();
    res.status(200).json({ data: club });
  }),

  // @desc update specific offer by id
  // route PUT /api/v1/club/:clubId/offers/:offerId
  // access private
  updateOffer: asyncHandler(async (req, res, next) => {
    const { clubId, offerId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(400).json({ message: "club not found" });
    }
    const offer = club.offers.id(offerId);
    if (!offer) {
      return res.status(400).json({ message: "offer not found" });
    }
    offer.set(req.body);
    await club.save();
    res.status(200).json({ data: club });
  }),
  // @desc get specific offer by id
  // route GET /api/v1/club/:clubId/offers/:offerId
  // access public
  getOffer: asyncHandler(async (req, res, next) => {
    const { clubId, offerId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(400).json({ message: "club not found" });
    }
    const offer = club.offers.id(offerId);
    if (!offer) {
      return res.status(400).json({ message: "offer not found" });
    }
    res.status(200).json({ data: offer });
  }),
  getClubMembers: asyncHandler(async (req, res, next) => {
    const { clubId } = req.params;
    const club = await Club.findById(clubId).populate({
      path: "offers",
      populate: [
        { path: "subscribes", model: "User" },
        { path: "club", model: "Club" },
      ],
    });

    const members = [];

    club.offers.forEach((offer) => {
      offer.subscribes.forEach((user) => {
        members.push({
          user,
          offer: {
            _id: offer._id,
            name: offer.name,
            description: offer.description,
            price: offer.price,
            isSpecial: offer.isSpecial,
          },
        });
      });
    });

    res.json(members);
  }),
  deleteMember: asyncHandler(async (req, res, next) => {
    const { clubId, userId } = req.params;

    // Find the club by clubId
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Find the offer that contains the userId in its subscribes array
    const offer = club.offers.find((offer) =>
      offer.subscribes.includes(userId)
    );

    if (!offer) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Remove the userId from the offer's subscribes array
    offer.subscribes = offer.subscribes.filter(
      (sub) => sub.toString() !== userId
    );

    // Save the updated club
    await club.save();

    res.json({ message: "Member deleted successfully" });
  }),
  updateMember: asyncHandler(async (req, res, next) => {
    const { clubId, memberId } = req.params;
    const { updatedData } = req.body;

    // Find the club by clubId
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Find the offer that contains the userId in its subscribes array
    const offer = club.offers.find((offer) =>
      offer.subscribes.includes(memberId)
    );

    if (!offer) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Find the user within the offer's subscribes array
    const userIndex = offer.subscribes.findIndex(
      (sub) => sub.toString() === memberId
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Update the member's data
    Object.assign(offer.subscribes[userIndex], updatedData);

    // Save the updated club
    await club.save();

    res.json({ message: "Member updated successfully" });
  }),
};
