const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Product = require("../models/productModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

/////////////////////////////////////////////////////

module.exports = {
  uploadProdductImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${filename}`);
      //save image to our dataBase
      req.body.image = `${process.env.URL_BASE}/products/${filename}`;
    }

    next();
  }),

  createProduct: Factory.createOne(Product),
  //@desc     create Product
  //route     POST /api/v1/Products
  //access    private

  getProducts: Factory.getAll(Product, "Product"),
  //@desc     get list of Product
  //route     GET /api/v1/Products
  //access    public

  getProduct: Factory.getOnebyId(Product, "Product"),
  //@desc     get specific Product by id
  //route     GET /api/v1/Products/:id
  //access    public
  updateProduct: Factory.updateOnebyId(Product, "Product"),
  //@desc    update specific Product by id
  //route     PUT /api/v1/Products/:id
  //access    private
  deleteProduct: Factory.deleteOne(Product, "Product"),
  //@desc    delete specific Product by id
  //route     DELETE /api/v1/Products/:id
  //access    private
};
