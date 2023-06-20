const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const sliderModel = mongoose.model("Slider", sliderSchema);

module.exports = sliderModel;
