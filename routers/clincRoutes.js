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
  createClinic,
  getClinics,
  getClinic,
  updateClinic,
  deleteClinic,
  addServices,
  getServices,
  deleteService,
  updateService,
  getService,
} = require("../controllers/clincController");

/////////////////////////////////

Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  createClinic
);
Router.get("/", getClinics);
Router.get("/:id", getClinic);
Router.put(
  "/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateClinic
);
Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteClinic);
//////////////////////////////////////////////////////////////////
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

module.exports = Router;
