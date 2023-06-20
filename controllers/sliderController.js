const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Slider = require("../models/slider");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

/////////////////////////////////////////////////////

module.exports = {
  uploadProdductImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `slider-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 400)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/slider/${filename}`);
      //save image to our dataBase
      req.body.image = `${process.env.URL_BASE}/slider/${filename}`;
    }

    next();
  }),

  createSlider: Factory.createOne(Slider),
  //@desc     create Slider
  //route     POST /api/v1/Sliders
  //access    private

  getSliders: Factory.getAll(Slider, "Slider"),
  //@desc     get list of Slider
  //route     GET /api/v1/Sliders
  //access    public

  getSlider: Factory.getOnebyId(Slider, "Slider"),
  //@desc     get specific Slider by id
  //route     GET /api/v1/Sliders/:id
  //access    public
  updateSlider: Factory.updateOnebyId(Slider, "Slider"),
  //@desc    update specific Slider by id
  //route     PUT /api/v1/Sliders/:id
  //access    private
  deleteSlider: Factory.deleteOne(Slider, "Slider"),
  //@desc    delete specific Slider by id
  //route     DELETE /api/v1/Sliders/:id
  //access    private
};
