const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
      trim: true,
    },
    description: {
      type: String,
      minlength: [20, "too short product description"],
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "product price is required"],
      max: [200000, "Too long product price"],
    },
    image: {
      type: String,
      required: [true, "product image  is required"],
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
    phyclinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "phyiscalclinic",
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
