const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");

// const {
//   createProductValidator,
//   deleteProductValidator,
//   getProductValidator,
//   updateProductValidator,
// } = require("../utils/validation/productValidation");

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  resizeImage,
  updateProduct,
  uploadProdductImage,
} = require("../controllers/productController");

/////////////////////////////////
//club////////////////////////////
Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadProdductImage,
  resizeImage,
  createProduct
);
Router.get("/", getProducts);
Router.put(
  "/:id",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  updateProduct
);

Router.delete("/:id", auth.Protect, auth.allowedTo("admin"), deleteProduct);

Router.get("/:id", getProduct);
// ///////////////////////////////////////////////////////

module.exports = Router;
