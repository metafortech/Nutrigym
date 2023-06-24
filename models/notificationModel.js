const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
