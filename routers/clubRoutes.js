const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");

// const {
//   createProductValidator,
//   deleteProductValidator,
//   getProductValidator,
//   updateProductValidator,
// } = require("../utils/validation/productValidation");

const {
  createClub,
  deleteClub,
  getClub,
  getClubs,
  updateClub,
  addOffers,
  getOffers,
  deleteOffer,
  updateOffer,
  getOffer,
} = require("../controllers/clubController");

/////////////////////////////////
//club////////////////////////////
Router.post("/", auth.Protect, auth.allowedTo("admin", "manager"), createClub);
Router.get("/", getClubs);
Router.put(
  "/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateClub
);

Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteClub);

Router.get("/:id", getClub);
///////////////////////////////////////////////////////
////offers

Router.post(
  "/offers/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  addOffers
);

Router.get("/offers/:id", getOffers);

Router.get("/:clubId/offers/:offerId", getOffer);

Router.put(
  "/updateOfer/:clubId/offers/:offerId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateOffer
);

Router.delete(
  "/deleteOfer/:clubId/offers/:offerId",
  auth.Protect,
  auth.allowedTo("admin"),
  deleteOffer
);

module.exports = Router;
