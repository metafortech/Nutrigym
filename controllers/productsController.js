// const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Product = require("../models/productModel");
const Factory = require("./handlerFactory");
/////////////////////////////////////////////////////

module.exports = {
  uploadProductImages: uploadSingleImage("image"),

  resizeProductImageCover: asyncHandler(async (req, res, next) => {
    //console.log(req.files);
    //1- image Processing for imageCover

    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-Cover.jpeg`;
    if (req.file) {
      await sharp(req.files.imageCover.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFilename}`);

      //save image to our dataBase
      req.body.imageCover = imageCoverFilename;
    }
    next();
  }),

  createProduct: asyncHandler(async (req, res, next) => {
    const { title, price, description, quantity, image } = req.body;

    const img = `https://whale-app-8clhi.ondigitalocean.app/api/v1/products/${image}`;
    const product = new Product({
      title,
      price,
      description,
      quantity,
      image: img,
    });
    console.log(product);
    // await product.save();
    res.status(201).json({ msg: "done" });
  }),
  //@desc     create product
  //route     POST /api/v1/products
  //access    private

  getProducts: Factory.getAll(Product, "Product"),
  //@desc     get list of product
  //route     GET /api/v1/products
  //access    public

  getProduct: Factory.getOnebyId(Product, "Product", "reviews"),

  //@desc     get specific product by id
  //route     GET /api/v1/products/:id
  //access    public
  updateProduct: Factory.updateOnebyId(Product, "Product"),

  //@desc    update specific product by id
  //route     PUT /api/v1/products/:id
  //access    private

  deleteProduct: Factory.deleteOne(Product, "Product"),

  //@desc    delete specific product by id
  //route     DELETE /api/v1/products/:id
  //access    private
};
