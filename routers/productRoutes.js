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
  uploadImgCloud,
  addProductsInClub,
  addProductsInClinic,
  addProductsInPhyClinic,
  deleteProductInClub,
  deleteProductInClinic,
  deleteProductInPhyClinic,
  getProductsInClub,
  getProductsInClinic,
  getProductsInPhyClinic,
} = require("../controllers/productController");

/////////////////////////////////
//club////////////////////////////
Router.post(
  "/",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadProdductImage,
  uploadImgCloud,
  createProduct
);
//////club products///////
Router.post(
  "/ToClub/:clubId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadProdductImage,
  uploadImgCloud,
  addProductsInClub
);

Router.get("/inClub/:clubId", auth.Protect, getProductsInClub);

Router.delete(
  "/club/:clubId/product/:productId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  deleteProductInClub
);

////////////////////////////////////////////////
//////clinic products///////
Router.post(
  "/ToClinic/:clinicId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadProdductImage,
  uploadImgCloud,
  addProductsInClinic
);

Router.get("/inClinic/:clinicId", auth.Protect, getProductsInClinic);

Router.delete(
  "/clinic/:clinicId/product/:productId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  deleteProductInClinic
);

//////////////////////////////////////
//////phyclinic products///////
Router.post(
  "/ToPhyClinic/:clinicId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  uploadProdductImage,
  uploadImgCloud,
  addProductsInPhyClinic
);

Router.get("/inPhyClinic/:clinicId", auth.Protect, getProductsInPhyClinic);

Router.delete(
  "/PhyClinic/:clinicId/product/:productId",
  auth.Protect,
  auth.allowedTo("admin", "manager"),
  deleteProductInPhyClinic
);

/////////////////////////////////////////////
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
