const FeedingSchedule = require("../models/feedingModel");
const User = require("../models/userModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

/////////////////////////////////////////////////////

module.exports = {
  createFeedingScheduleForUser: asyncHandler(async (req, res, next) => {
    const { date, userId } = req.body;

    // Check if a feeding schedule already exists for the given date and user
    const existingSchedule = await FeedingSchedule.findOne({
      date,
      user: userId,
    });

    if (existingSchedule) {
      return res
        .status(400)
        .json({ error: "Feeding schedule already exists for this date" });
    }

    // Create a new feeding schedule
    const feedingSchedule = new FeedingSchedule({
      date,
      meals: [],
      user: userId,
    });
    await feedingSchedule.save();
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { feedingSchedule: feedingSchedule._id } },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ error: "can not find this user" });
    }

    res.status(200).json({ data: feedingSchedule });
  }),
  addFeedingScheduleForUser: asyncHandler(async (req, res, next) => {
    const { schedualId } = req.params;
    const { calories, mealName, mealDescription, mealCalories } = req.body;

    // Check if a feeding schedule already exists for the given date and user
    const Schedule = await FeedingSchedule.findById(schedualId);

    if (!Schedule) {
      return res.status(400).json({ msg: "no Schedule with this id" });
    }

    // Create a new feeding schedule
    Schedule.meals.push({
      name: mealName,
      description: mealDescription,
      calories: mealCalories,
    });
    await Schedule.save();

    res.status(200).json({ data: Schedule });
  }),
  getFeddinScheduleByDate: asyncHandler(async (req, res, next) => {
    const { date } = req.params;

    const feedingSchedule = await FeedingSchedule.findOne({
      date,
      user: req.user._id,
    });

    if (!feedingSchedule) {
      return res.status(404).json({ error: "Feeding schedule not found" });
    }

    res.status(200).json({ data: feedingSchedule });
  }),
  getAllFeddinSchedule: asyncHandler(async (req, res, next) => {
    const feedingSchedule = await FeedingSchedule.find().populate(
      "user",
      "name email"
    );

    if (!feedingSchedule) {
      return res.status(404).json({ error: "Feeding schedule not found" });
    }

    res.status(200).json({ data: feedingSchedule });
  }),
  updateFeedingScheduleByDate: asyncHandler(async (req, res, next) => {
    const { date } = req.params;
    const { mealName, mealDescription, mealCalories, userId } = req.body;

    let feedingSchedule = await FeedingSchedule.findOne({
      date,
      user: userId,
    });

    if (!feedingSchedule) {
      // Create a new feeding schedule if it doesn't exist for the given date
      feedingSchedule = new FeedingSchedule({
        date,
        meals: {
          name: mealName,
          description: mealDescription,
          calories: mealCalories,
        },
        user: userId,
      });
    } else {
      // Update the existing feeding schedule if it already exists for the given date
      feedingSchedule.meals = {
        name: mealName,
        description: mealDescription,
        calories: mealCalories,
      };
    }

    await feedingSchedule.save();

    res.status(200).json({ data: feedingSchedule });
  }),
  markMealAsCompleted: asyncHandler(async (req, res, next) => {
    const { date, mealId } = req.params;
    const userId = req.user._id; // Assuming you have the user's ID available in the request object

    const feedingSchedule = await FeedingSchedule.findOne({
      date,
      user: userId,
    });

    if (!feedingSchedule) {
      return res.status(404).json({ error: "Feeding schedule not found" });
    }

    const meal = feedingSchedule.meals.find(
      (meal) => meal._id.toString() === mealId
    );

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    if ((meal.completed = true)) {
      return res.status(404).json({ error: "Meal is alredy completed" });
    }
    meal.completed = true;

    const userCal = await User.findOne({ _id: userId });
    userCal.callories.push({ title: meal.name, callory: meal.calories });
    await userCal.save();

    await feedingSchedule.save();

    res.json(feedingSchedule);
  }),
  markMealAsNotCompleted: asyncHandler(async (req, res, next) => {
    const { date, mealId } = req.params;
    const userId = req.user._id; // Assuming you have the user's ID available in the request object

    const feedingSchedule = await FeedingSchedule.findOne({
      date,
      user: userId,
    });

    if (!feedingSchedule) {
      return res.status(404).json({ error: "Feeding schedule not found" });
    }

    const meal = feedingSchedule.meals.find(
      (meal) => meal._id.toString() === mealId
    );

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    meal.completed = false;

    if ((meal.completed = true)) {
      return res
        .status(404)
        .json({ error: "Meal is alredy marked as notCompleted" });
    }

    const userCal = await User.findOne({ _id: userId });
    userCal.callories.pop({ title: meal.name, callory: meal.calories });
    await userCal.save();

    await feedingSchedule.save();

    res.json(feedingSchedule);
  }),

  deleteFeedingScheduleByDate: asyncHandler(async (req, res, next) => {
    const { date, userId } = req.params;
    const feeding = await FeedingSchedule.findOne({ date, user: userId });
    if (!feeding) {
      return res.status(404).json({ error: "Feeding schedule not found" });
    }

    const user = await User.findById(userId);
    user.feedingSchedule.pop(feeding._id);
    await user.save();
    await feeding.remove();
    res.json({ message: "Feeding schedule deleted successfully" });
  }),
};
