const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

/////////////////////////////////////////////////////

const deleteNotificationFromUser = async (notificationId, req, res) => {
  // Find the notification by its ID
  const notification = await Notification.findOne({ _id: notificationId });
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  // Remove the notification ID from the user's notifications array
  const user = await User.findOne({ _id: notification.user });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const notificationIndex = user.notification.indexOf(notificationId);
  if (notificationIndex !== -1) {
    user.notification.splice(notificationIndex, 1);
  }

  await user.save();

  // Delete the notification
  await notification.remove();

  res.status(200).json({ message: "Notification deleted successfully" });
};

const deleteNotificationFromAllUsers = async (notificationId, req, res) => {
  // Delete the notification from all users
  await User.updateMany(
    { notification: notificationId },
    { $pull: { notification: notificationId } }
  );

  // Delete the notification
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.status(200).json({ message: "Notification deleted successfully" });
};

module.exports = {
  pushNotificationToUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { subject, message } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const notification = new Notification({
      subject,
      message,
    });

    notification.user = userId;
    await notification.save();

    user.notification.push(notification._id);
    await user.save();
    res.status(200).json({ data: notification });
  }),
  pushNotificationAllUsers: asyncHandler(async (req, res, next) => {
    const { subject, message } = req.body;

    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }

    const notification = new Notification({
      subject,
      message,
    });

    await notification.save();
    console.log(notification);

    const notificationIds = users.map((user) => {
      user.notification.push(notification._id);
      return user._id;
    });

    await User.updateMany(
      { _id: { $in: notificationIds } },
      { $push: { notification: notification._id } }
    );

    res.status(200).json({ notification });
  }),

  getNotification: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id)
      .populate("notification")
      .select("notification");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    res.status(200).json({ data: user });
  }),
  //@desc     create Notification
  //route     POST /api/v1/Notifications
  //access    private

  getNotifications: Factory.getAll(
    Notification,
    "Notification",
    "user",
    "name"
  ),

  deleteNotification: asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;

    // Find the notification by its ID
    const notification = await Notification.findOne({ _id: notificationId });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Remove the notification ID from the user's notifications array
    const user = await User.findOne({ _id: notification.user });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notificationIndex = user.notification.indexOf(notificationId);
    if (notificationIndex !== -1) {
      user.notification.splice(notificationIndex, 1);
    }

    await user.save();

    // Delete the notification
    await notification.remove();

    res.status(200).json({ message: "Notification deleted successfully" });
  }),
  deleteNotificationFromAllUsers: asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;

    // Delete the notification from all users
    await User.updateMany(
      { notification: notificationId },
      { $pull: { notification: notificationId } }
    );

    // Delete the notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  }),
  checkNotification: asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    const notification = await Notification.findOne({ _id: notificationId });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.user
      ? deleteNotificationFromUser(notificationId, req, res)
      : deleteNotificationFromAllUsers(notificationId, req, res);
  }),
};
