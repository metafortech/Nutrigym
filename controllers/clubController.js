const Club = require("../models/clubModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

/////////////////////////////////////////////////////

module.exports = {
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

  getClubs: Factory.getAll(Club, "Club", "manager", "name email phone"),
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
};
