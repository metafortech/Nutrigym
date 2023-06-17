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
  cancelSubForClinic,
  cancelSubForPhyClinic,
  cancelSubForClinicService,
  cancelSubForPhyClinicService,
  cancelSubForClubOffer,
  getSubsForClub,
  subNewMemberforOffer,
} = require("../controllers/subsController");

/////////////////////////////////
//for all routes under
Router.use(auth.Protect);

Router.post("/clinic", auth.allowedTo("admin", "user"), createSubForClinic);

Router.post("/clinic/services/:serviceId", subforClinicService);
// Router.get("/mySubs", getMySubs);
Router.get("/clinic/myofferSubs", getmyClinicServicesSub);
Router.post("/cancelClinicSub/:subId", cancelSubForClinic);
Router.post("/cancelClinicServiceSub/:serviceId", cancelSubForClinicService);

///////////////////////////////////phyclinic//////////////////////////////
Router.post(
  "/phyclinic",
  auth.allowedTo("admin", "user"),
  createSubForPhyClinic
);

Router.post("/phyclinic/services/:serviceId", subforPhyService);
// Router.get("/mySubs", getMySubs);
Router.get("/phyclinic/myofferSubs", getmyPhyservicesSub);
Router.post("/cancelphyClinicSub/:subId", cancelSubForPhyClinic);
Router.post(
  "/cancelphyClinicServiceSub/:serviceId",
  cancelSubForPhyClinicService
);

/////////////////////club///////////////////////////
Router.post("/club", auth.allowedTo("admin", "user"), createSubForClub);
Router.get("/", getSubs);
Router.post("/offers/:offerId", subforOffer);
Router.post("/offers/:offerId/member/:memberId", subNewMemberforOffer);
Router.post("/cancelClubSub/:subId", cancelSubForClub);
Router.post("/cancelClubOfferSub/:offerId", cancelSubForClubOffer);

///////////////////////////////////////////////////
Router.get("/mySubs", getMySubs);
Router.get("/myofferSubs", getmyoffersSub);
Router.get("/clubSubs/:id", getSubsForClub);

module.exports = Router;
