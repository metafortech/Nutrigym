const mongoose = require("mongoose");

const feedingScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    meals: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        calories: Number,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const FeedingSchedule = mongoose.model(
  "FeedingSchedule",
  feedingScheduleSchema
);

module.exports = FeedingSchedule;
