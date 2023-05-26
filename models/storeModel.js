const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
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
      ratings: {
        type: Number,
        min: [1, "min ratings value is 1.0"],
        max: [5, "max ratings value is 5.0"],
        required: [true, "Review ratings is required"],
      },
    },
    menu: [
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
        calories: {
          type: Number,
          required: true,
        },
      },
    ],
    products: [
      {
        // The products offered by the store
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    deliveryPrice: {
      // The delivery price for the store
      type: Number,
      required: true,
      min: 0,
    },
    freeDeliveryThreshold: {
      // The minimum order amount for free delivery from the store
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

const storeModel = mongoose.model("Store", storeSchema);

module.exports = storeModel;
