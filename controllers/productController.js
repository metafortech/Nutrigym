const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Product = require("../models/productModel");
const Club = require("../models/clubModel");
const Clinic = require("../models/clinicModel");
const phyClinic = require("../models/phyiscalclinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("../middlewares/uploadImageCloudnary");

/////////////////////////////////////////////////////

module.exports = {
  uploadProdductImage: uploadSingleImage("image"),
  uploadImgCloud: asyncHandler(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.url;
    next();
  }),
  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${filename}`);
      //save image to our dataBase
      req.body.image = `https://whale-app-8clhi.ondigitalocean.app/products/${filename}`;
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
  addProductsInClub: asyncHandler(async (req, res, next) => {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(400).json({ message: "no gym with this id" });
    }
    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== club.manager.toString()) {
        return res
          .status(401)
          .json({ message: "you are not the manager of this gym" });
      }
    }
    const product = await Product.create(req.body);
    product.club = clubId;
    await product.save();
    club.clubProducts.push(product._id);
    await club.save();
    res.status(201).json({ msg: "done", data: product });
  }),
  getProductsInClub: asyncHandler(async (req, res, next) => {
    const { clubId } = req.params;
    const club = await Club.findById(clubId)
      .select("clubProducts")
      .populate("clubProducts");
    if (!club) {
      return res.status(400).json({ message: "no gym with this id" });
    }

    res.status(201).json({ msg: "done", data: club });
  }),

  deleteProductInClub: asyncHandler(async (req, res, next) => {
    const { clubId, productId } = req.params;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(400).json({ message: "No gym with this id" });
    }

    const productIndex = club.clubProducts.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "No product with this id in the gym" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "No product with this id" });
    }

    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== club.manager.toString()) {
        return res
          .status(401)
          .json({ message: "You are not the manager of this gym" });
      }
    }

    await Product.findByIdAndDelete(productId);
    club.clubProducts.splice(productIndex, 1);
    await club.save();

    res.status(200).json({ msg: "Product deleted successfully" });
  }),

  addProductsInClinic: asyncHandler(async (req, res, next) => {
    const { clinicId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "no clinic with this id" });
    }
    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== clinic.manager.toString()) {
        return res
          .status(401)
          .json({ message: "you are not the manager of this clinic" });
      }
    }
    const product = await Product.create(req.body);
    product.clinic = clinicId;
    await product.save();
    clinic.clinicProducts.push(product._id);
    await clinic.save();
    res.status(201).json({ msg: "done", data: product });
  }),
  getProductsInClinic: asyncHandler(async (req, res, next) => {
    const { clinicId } = req.params;
    const clinic = await Clinic.findById(clinicId)
      .select("clinicProducts")
      .populate("clinicProducts");
    if (!clinic) {
      return res.status(400).json({ message: "no clinic with this id" });
    }

    res.status(201).json({ msg: "done", data: clinic });
  }),
  deleteProductInClinic: asyncHandler(async (req, res, next) => {
    const { clinicId, productId } = req.params;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "No clinic with this id" });
    }

    const productIndex = clinic.clinicProducts.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "No product with this id in the clinic" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "No product with this id" });
    }

    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== clinic.manager.toString()) {
        return res
          .status(401)
          .json({ message: "You are not the manager of this clinic" });
      }
    }

    await Product.findByIdAndDelete(productId);
    clinic.clinicProducts.splice(productIndex, 1);
    await clinic.save();

    res.status(200).json({ msg: "Product deleted successfully" });
  }),
  addProductsInPhyClinic: asyncHandler(async (req, res, next) => {
    const { clinicId } = req.params;
    const clinic = await phyClinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "no phyclinic with this id" });
    }
    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== clinic.manager.toString()) {
        return res
          .status(401)
          .json({ message: "you are not the manager of this phyclinic" });
      }
    }
    const product = await Product.create(req.body);
    product.clinic = clinicId;
    await product.save();
    clinic.phyProducts.push(product._id);
    await clinic.save();
    res.status(201).json({ msg: "done", data: product });
  }),
  getProductsInPhyClinic: asyncHandler(async (req, res, next) => {
    const { clinicId } = req.params;
    const clinic = await phyClinic
      .findById(clinicId)
      .select("phyProducts")
      .populate("phyProducts");
    if (!clinic) {
      return res.status(400).json({ message: "no phyClinic with this id" });
    }

    res.status(201).json({ msg: "done", data: clinic });
  }),
  deleteProductInPhyClinic: asyncHandler(async (req, res, next) => {
    const { clinicId, productId } = req.params;

    const clinic = await phyClinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "No phyClinic with this id" });
    }

    const productIndex = clinic.phyProducts.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "No product with this id in the phyClinic" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "No product with this id" });
    }

    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== clinic.manager.toString()) {
        return res
          .status(401)
          .json({ message: "You are not the manager of this phyClinic" });
      }
    }

    await Product.findByIdAndDelete(productId);
    clinic.phyProducts.splice(productIndex, 1);
    await clinic.save();

    res.status(200).json({ msg: "Product deleted successfully" });
  }),
};
