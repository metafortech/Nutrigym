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
  deleteExercise,
  getExercise,
  getExercises,
  resizeImage,
  updateExercise,
  uploadExerciseImage,
  getUserExercises,
  createExerciseForUser,
  addExerciseForUser,
  markExerciseAsDone,
  markExerciseAsNotDone,
  uploadImgCloud,
} = require("../controllers/exerciseController");

/////////////////////////////////
//club////////////////////////////
Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  createExerciseForUser
);
Router.post(
  "/addForUser/:exerciseId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadExerciseImage,
  uploadImgCloud,
  addExerciseForUser
);
Router.get("/", getExercises);
Router.get("/myExercise", auth.Protect, getUserExercises);
Router.put(
  "/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateExercise
);

Router.put(
  "/:exerciseId/item/:exItemId",
  auth.Protect,
  auth.allowedTo("user"),
  markExerciseAsDone
);
Router.put(
  "/:exerciseId/notDone/item/:exItemId",
  auth.Protect,
  auth.allowedTo("user"),
  markExerciseAsNotDone
);

Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteExercise);

Router.get("/:id", getExercise);
///////////////////////////////////////////////////////

module.exports = Router;
