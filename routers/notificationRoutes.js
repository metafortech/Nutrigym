const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");

const {
  pushNotificationToUser,
  getNotification,
  pushNotificationAllUsers,
  getNotifications,
  deleteNotification,
  deleteNotificationFromAllUsers,
  checkNotification,
} = require("../controllers/notificationController");

/////////////////////////////////

Router.post(
  "/:userId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  pushNotificationToUser
);
Router.get("/notificationUser/:id", getNotification);
Router.get("/send-notification", pushNotificationAllUsers);
Router.get("/", getNotifications);

Router.delete(
  "/deleteNotification/:notificationId",
  auth.Protect,
  auth.allowedTo("admin"),
  deleteNotification
);

Router.delete(
  "/deleteNotificationAllUsers/:notificationId",
  auth.Protect,
  auth.allowedTo("admin"),
  deleteNotificationFromAllUsers
);
Router.delete("/check/:notificationId", auth.Protect, checkNotification);

module.exports = Router;
