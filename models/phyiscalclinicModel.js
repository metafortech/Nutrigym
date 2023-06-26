const mongoose = require("mongoose");

const phyiscalclinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      governorate: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
    },
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
    },
    manager: { type: mongoose.Schema.ObjectId, ref: "User" },
    subscribes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        subscribes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        isSpecial: { type: Boolean, default: false },
      },
    ],
    phyProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const phyiscalclinicModel = mongoose.model(
  "phyiscalclinic",
  phyiscalclinicSchema
);

module.exports = phyiscalclinicModel;
