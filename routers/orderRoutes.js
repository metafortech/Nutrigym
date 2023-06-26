const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createCashOrder,
  createCliqOrder,
  createZainCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderPaid,
  updateOrderShippedToDelivered,
  updateOrderShippedToOnWay,
  uploadCliQCashReceipt,
  uploadExerciseImage,
  uploadImgCloud,
  uploadZainCashReceipt,
} = require("../controllers/orderController");

Router.post("/:cartId", auth.allowedTo("user"), createCashOrder);
Router.post("/ZainCash/:cartId", auth.allowedTo("user"), createZainCashOrder);
Router.post("/CliQ/:cartId", auth.allowedTo("user"), createCliqOrder);
Router.get(
  "/",
  auth.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);
Router.get("/:id", findSpecificOrder);
Router.put("/:orderId/pay", auth.allowedTo("admin"), updateOrderPaid);
Router.put(
  "/:orderId/payZainCashReceipt",
  auth.allowedTo("admin"),
  uploadExerciseImage,
  uploadImgCloud,
  uploadZainCashReceipt
);
Router.put(
  "/:orderId/payCliQCashReceipt",
  auth.allowedTo("admin"),
  uploadExerciseImage,
  uploadImgCloud,
  uploadCliQCashReceipt
);

Router.put(
  "/:orderId/onWay",
  auth.allowedTo("admin"),
  updateOrderShippedToOnWay
);
Router.put(
  "/:orderId/delivered",
  auth.allowedTo("admin"),
  updateOrderShippedToDelivered
);

module.exports = Router;
