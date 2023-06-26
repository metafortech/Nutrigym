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
  createSlider,
  deleteSlider,
  getSlider,
  getSliders,
  resizeImage,
  updateSlider,
  uploadImgCloud,
  uploadSliderImage,
} = require("../controllers/sliderController");

/////////////////////////////////
//club////////////////////////////
Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin"),
  uploadSliderImage,
  uploadImgCloud,
  createSlider
);
Router.get("/", getSliders);
Router.put("/:id", auth.Protect, auth.allowedTo("admin"), updateSlider);

Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteSlider);

Router.get("/:id", getSlider);
// ///////////////////////////////////////////////////////

module.exports = Router;
