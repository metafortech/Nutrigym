const mongoose = require("mongoose");

const offersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
      required: [true, "Review ratings is required"],
    },
    subscribes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],

    subscriber: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    club: {
      type: mongoose.Schema.ObjectId,
      ref: "Club",
    },
    clinic: {
      type: mongoose.Schema.ObjectId,
      ref: "Clinc",
    },
    phyclinic: {
      type: mongoose.Schema.ObjectId,
      ref: "phyiscalclinic",
    },
    isSpecial: Boolean,
  },
  { timestamps: true }
);

const offersModel = mongoose.model("Offers", offersSchema);

module.exports = offersModel;
