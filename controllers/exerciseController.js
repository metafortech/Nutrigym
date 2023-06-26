const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Exercise = require("../models/exercisesModel");
const User = require("../models/userModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("../middlewares/uploadImageCloudnary");

/////////////////////////////////////////////////////

module.exports = {
  uploadExerciseImage: uploadSingleImage("image"),
  uploadImgCloud: asyncHandler(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.url;
    next();
  }),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `exercises-${uuidv4()}-${Date.now()}.gif`;
    if (req.file) {
      await sharp(req.file.buffer).toFormat("gif").gif();
      //save image to our dataBase
      req.body.image = filename;
    }
    next();
  }),

  createExerciseForUser: asyncHandler(async (req, res, next) => {
    const { trainee } = req.body;

    const exercise = new Exercise({
      trainee,
      exeDone: false,
      exercises: [],
    });

    await exercise.save();
    const user = await User.findByIdAndUpdate(
      exercise.trainee,
      { $push: { exercises: exercise._id } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ msg: "no user with this id" });
    }
    user.exercises.push(exercise._id);

    await user.save();

    res.status(201).json({ msg: "done", data: exercise });
  }),
  //@desc     create Exercise
  //route     POST /api/v1/Exercises
  //access    private

  addExerciseForUser: asyncHandler(async (req, res, next) => {
    const { exerciseId } = req.params;
    const { name, description, calories, image, reps, sets } = req.body;
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(400).json({ msg: "no exercise with this id" });
    }
    // const img = `${process.env.URL_BASE}/exercises/${image}`;
    exercise.exercises.push({
      name,
      description,
      calories,
      image,
      reps,
      sets,
    });

    await exercise.save();
    res.status(201).json({ msg: "done", data: exercise });
  }),
  getExercises: asyncHandler(async (req, res, next) => {
    const exercises = await Exercise.find().populate("trainee", "name email");

    res.status(200).json({ data: exercises });
  }),
  //@desc     get list of Exercise
  //route     GET /api/v1/Exercises
  //access    public

  getExercise: asyncHandler(async (req, res, next) => {
    const exerciseId = req.params.id;

    const exercise = await Exercise.findById(exerciseId).populate(
      "trainee",
      "name email"
    );
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.status(200).json({ data: exercise });
  }),
  //@desc     get specific Exercise by id
  //route     GET /api/v1/Exercises/:id
  //access    public
  updateExercise: asyncHandler(async (req, res, next) => {
    const exerciseId = req.params.id;
    const { name, description, image, calories, reps, sets } = req.body;

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    exercise.exercises = [{ name, description, image, calories, reps, sets }];

    await exercise.save();

    res.status(200).json({ data: exercise });
  }),
  //@desc    update specific Exercise by id
  //route     PUT /api/v1/Exercises/:id
  //access    private

  deleteExercise: asyncHandler(async (req, res, next) => {
    const exerciseId = req.params.id;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    const user = await User.findById(exercise.trainee);
    user.exercises.pop(exerciseId);
    await exercise.remove();
    await user.save();
    res.status(200).json({ message: "Exercise deleted successfully" });
  }),
  //@desc    delete specific Exercise by id
  //route     DELETE /api/v1/Exercises/:id
  //access    private
  getUserExercises: asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const exercises = await Exercise.find({ trainee: userId });

    res.json(exercises);
  }),
  markExerciseAsDone: asyncHandler(async (req, res, next) => {
    const { exerciseId, exItemId } = req.params;
    const exer = await Exercise.findById(exerciseId);
    if (!exer) {
      return res.status(400).json({ msg: "no exercise with this id" });
    }
    const exerciseObj = exer.exercises.find(
      (ex) => ex._id.toString() === exItemId
    );

    if (exerciseObj.exeDone === true) {
      return res.status(404).json({ error: "exercise is alredy done" });
    }
    exerciseObj.exeDone = true;

    const userCal = await User.findOne({ _id: req.user._id });
    userCal.callories.push({
      title: exerciseObj.name,
      callory: exerciseObj.calories,
    });
    await userCal.save();

    await exer.save();

    res.json(exer);
  }),
  markExerciseAsNotDone: asyncHandler(async (req, res, next) => {
    const { exerciseId, exItemId } = req.params;
    const exer = await Exercise.findById(exerciseId);
    if (!exer) {
      return res.status(400).json({ msg: "no exercise with this id" });
    }
    const exerciseObj = exer.exercises.find(
      (ex) => ex._id.toString() === exItemId
    );

    if (exerciseObj.exeDone === false) {
      return res.status(404).json({ error: "exercise is alredy not done" });
    }
    exerciseObj.exeDone = false;

    const userCal = await User.findOne({ _id: req.user._id });
    userCal.callories.pop({
      title: exerciseObj.name,
      callory: exerciseObj.calories,
    });
    await userCal.save();

    await exer.save();

    res.json(exer);
  }),
};
