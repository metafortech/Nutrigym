const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    trainee: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    exercises: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: String,
        calories: Number,
        reps: Number,
        sets: Number,
        exeDone: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const exercisesModel = mongoose.model("Exercises", exerciseSchema);

module.exports = exercisesModel;
