const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "this email is used"],
      required: true,
      lowercase: [true, "email required"],
    },
    phone: {
      type: String,
      required: true,
    },
    userImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "too short password"],
    },
    passwordChangedAt: Date,
    passwordRestCode: String,
    passwordRestExpires: Date,
    passwordRestVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    gender: { type: String, enum: ["male", "female"], required: true },
    subscibtions: [{ type: mongoose.Schema.ObjectId, ref: "Subs" }],
    exercises: [{ type: mongoose.Schema.ObjectId, ref: "Exercises" }],
    feedingSchedule: [
      { type: mongoose.Schema.ObjectId, ref: "FeedingSchedule" },
    ],
    clubManage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
    clinicManage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
      },
    ],
    phyClinicManage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "phyiscalclinic",
      },
    ],
    callories: [
      {
        title: String,
        callory: Number,
      },
    ],
    deviceToken: {
      type: String,
    },
    notification: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
