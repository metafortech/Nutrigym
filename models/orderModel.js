const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must belong to user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantaty: {
          type: Number,
        },
        price: Number,
      },
    ],

    shippingAddress: {
      details: String,
      phone: Number,
      city: String,
      postalCode: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["zainCash", "Cash", "CliQ"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    status: {
      type: String,
      enum: ["Pending", "Onway", "Delivered"],
      default: "Pending",
    },
    deliveredAt: Date,
    zainCashImg: String,
    CliQImage: String,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name userImg email phone" }).populate({
    path: "cartItems.product",
    select: "title  description",
  });
  next();
});

const ordelModel = mongoose.model("Order", orderSchema);

module.exports = ordelModel;
