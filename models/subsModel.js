const mongoose = require("mongoose");

const subsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfStart: Date,
    dateOfEnd: Date,
    description: {
      type: String,
    },
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
      ref: "Clinic",
    },
    phyclinic: {
      type: mongoose.Schema.ObjectId,
      ref: "phyiscalclinic",
    },
  },
  { timestamps: true }
);

const subsModel = mongoose.model("Subs", subsSchema);

module.exports = subsModel;
