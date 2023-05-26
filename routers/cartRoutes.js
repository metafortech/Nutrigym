const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");

const {
  addProductToCart,
  clearCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  updateCartItemQuantaty,
} = require("../controllers/cartController");

Router.use(auth.Protect, auth.allowedTo("user"));

Router.post("/", addProductToCart);
Router.delete("/", clearCart);
Router.get("/getMyCart", getLoggedUserCart);
Router.put("/:itemId", updateCartItemQuantaty);
Router.delete("/del/:itemId", removeSpecificCartItem);

module.exports = Router;
