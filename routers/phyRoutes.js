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
  createClinc,
  deleteClinc,
  getClinc,
  getClincs,
  updateClinc,
  addServices,
  deleteService,
  getService,
  getServices,
  updateService,
  deleteMember,
  getClubMembers,
  updateMember,
} = require("../controllers/phyClincController");

/////////////////////////////////

Router.post("/", auth.Protect, auth.allowedTo("admin", "manager"), createClinc);
Router.get("/", getClincs);
Router.get("/:id", getClinc);
Router.put(
  "/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateClinc
);
Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteClinc);
//////////////////////////////////////////////////
//services
Router.post(
  "/services/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  addServices
);

Router.get("/services/:id", getServices);

Router.get("/:clinicId/services/:serviceId", getService);

Router.put(
  "/updateService/:clinicId/services/:serviceId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateService
);

Router.delete(
  "/deleteService/:clinicId/services/:serviceId",
  auth.Protect,
  auth.allowedTo("admin"),
  deleteService
);
Router.put(
  "/:clinicId/member/:memberId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateMember
);

Router.get("/:clinicId/members", getClubMembers);

Router.delete(
  "/:clinicId/members/:userId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  deleteMember
);

module.exports = Router;
