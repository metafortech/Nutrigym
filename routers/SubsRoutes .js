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
  createSubForClub,
  getSubs,
  getMySubs,
  subforOffer,
  getmyoffersSub,
  createSubForClinic,
  createSubForPhyClinic,
  getmyClinicServicesSub,
  getmyPhyservicesSub,
  subforClinicService,
  subforPhyService,
  cancelSubForClub,
} = require("../controllers/subsController");

/////////////////////////////////
//for all routes under
Router.use(auth.Protect);

Router.post("/clinic", auth.allowedTo("admin", "user"), createSubForClinic);

Router.post("/clinic/services/:serviceId", subforClinicService);
// Router.get("/mySubs", getMySubs);
Router.get("/clinic/myofferSubs", getmyClinicServicesSub);

///////////////////////////////////phyclinic//////////////////////////////
Router.post(
  "/phyclinic",
  auth.allowedTo("admin", "user"),
  createSubForPhyClinic
);

Router.post("/phyclinic/services/:serviceId", subforPhyService);
// Router.get("/mySubs", getMySubs);
Router.get("/phyclinic/myofferSubs", getmyPhyservicesSub);

/////////////////////club///////////////////////////
Router.post("/club", auth.allowedTo("admin", "user"), createSubForClub);
Router.get("/", getSubs);
Router.post("/offers/:offerId", subforOffer);
Router.post("/cancelClubSub/:subId", cancelSubForClub);

///////////////////////////////////////////////////
Router.get("/mySubs", getMySubs);
Router.get("/myofferSubs", getmyoffersSub);

module.exports = Router;
