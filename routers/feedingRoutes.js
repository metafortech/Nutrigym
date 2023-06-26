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
  getFeddinScheduleByDate,
  getAllFeddinSchedule,
  updateFeedingScheduleByDate,
  markMealAsCompleted,
  markMealAsNotCompleted,
  deleteFeedingScheduleByDate,
  addFeedingScheduleForUser,
  createFeedingScheduleForUser,
} = require("../controllers/feedingController");

/////////////////////////////////

Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  createFeedingScheduleForUser
);
Router.post(
  "/addForUser/:schedualId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  addFeedingScheduleForUser
);
Router.get(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  getAllFeddinSchedule
);

Router.get(
  "/getmyFeddingByDate/:date",
  auth.Protect,
  auth.allowedTo("user"),
  getFeddinScheduleByDate
);
Router.put(
  "/date/:date/meal/:mealId",
  auth.Protect,
  auth.allowedTo("user"),
  markMealAsCompleted
);
Router.put(
  "/notCompleted/date/:date/meal/:mealId",
  auth.Protect,
  auth.allowedTo("user"),
  markMealAsNotCompleted
);

Router.put(
  "/:date",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateFeedingScheduleByDate
);
Router.delete(
  "/date/:date/:userId",
  auth.Protect,
  auth.allowedTo("admin"),
  deleteFeedingScheduleByDate
);

module.exports = Router;
