const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require("express-async-handler");
const ApiErr = require("../utils/apiError");
const Factory = require("./handlerFactory");

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("../middlewares/uploadImageCloudnary");

module.exports = {
  uploadExerciseImage: uploadSingleImage("image"),
  uploadImgCloud: asyncHandler(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.url;
    next();
  }),
  // @desc    create cash order
  // @route   POST /api/v1/orders/:cartId
  // @access  Protected/User
  createCashOrder: asyncHandler(async (req, res, next) => {
    //app setting
    const { shippingPrice } = 0;

    // 1) Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiErr("No cart with this id", 404));
    }
    const totalPrice = cart.totalPrice + shippingPrice;
    // 3) Create order with default paymentMethodType cash
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalPrice,
    });
    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantaty, sold: +item.quantaty } },
        },
      }));
      await Product.bulkWrite(bulkOption);
      // 5) Clear cart depend on cartId
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(200).json({ status: "success", data: order });
  }),
  createZainCashOrder: asyncHandler(async (req, res, next) => {
    const ZainCashNumber = 7700552222;
    // 1) Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiErr("No cart with this id", 404));
    }
    const totalPrice = cart.totalPrice;
    // 3) Create order with default paymentMethodType cash
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalPrice,
    });
    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantaty, sold: +item.quantaty } },
        },
      }));
      await Product.bulkWrite(bulkOption);
      // 5) Clear cart depend on cartId
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(200).json({ status: "success", data: order, ZainCashNumber });
  }),
  createCliqOrder: asyncHandler(async (req, res, next) => {
    const CliqCashNumber = "NUTRIGYM01";
    // 1) Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiErr("No cart with this id", 404));
    }
    const totalPrice = cart.totalPrice;
    // 3) Create order with default paymentMethodType cash
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalPrice,
    });
    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantaty, sold: +item.quantaty } },
        },
      }));
      await Product.bulkWrite(bulkOption);
      // 5) Clear cart depend on cartId
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(200).json({ status: "success", data: order, CliqCashNumber });
  }),
  filterOrderForLoggedUser: asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObject = { user: req.user._id };
    next();
  }),
  // @desc    get All orders
  // @route   POST /api/v1/orders/
  // @access  Protected/User-Admin-Maanger
  findAllOrders: Factory.getAll(Order, "Order"),

  // @desc    get All orders
  // @route   POST /api/v1/orders/
  // @access  Protected/User-Admin-Maanger
  findSpecificOrder: Factory.getOnebyId(Order, "Order"),

  // @desc    update order paid status
  // @route   POST /api/v1/orders/:orderId/pay
  // @access  Protected/Admin-Maanger

  updateOrderPaid: asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ApiErr("can not find order with this id", 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Paid updated",
      orderData: updatedOrder,
    });
  }),
  uploadZainCashReceipt: asyncHandler(async (req, res, next) => {
    const { image } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { zainCashImg: image },
      { new: true }
    );
    if (!order) {
      return next(new ApiErr("can not find order with this id", 404));
    }
    res.status(200).json({
      status: "success",
      message: "updated",
      orderData: order,
    });
  }),
  uploadCliQCashReceipt: asyncHandler(async (req, res, next) => {
    const { image } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { CliQImage: image },
      { new: true }
    );
    if (!order) {
      return next(new ApiErr("can not find order with this id", 404));
    }
    res.status(200).json({
      status: "success",
      message: "updated",
      orderData: order,
    });
  }),
  //   updateZainOrderPaid: asyncHandler(async (req, res, next) => {
  //     const order = await Order.findById(req.params.orderId);
  //     if (!order) {
  //       return next(new ApiErr("can not find order with this id", 404));
  //     }

  //     order.isPaid = true;
  //     order.paidAt = Date.now();

  //     const updatedOrder = await order.save();
  //     res.status(200).json({
  //       status: "success",
  //       message: "Paid updated",
  //       orderData: updatedOrder,
  //     });
  //   }),

  // @desc    update order shipping status
  // @route   POST /api/v1/orders/:orderId/shipped
  // @access  Protected/Admin-Maanger

  updateOrderShippedToOnWay: asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ApiErr("can not find ordewr with this id", 404));
    }
    order.status = "Onway";

    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Deliverd updated",
      orderData: updatedOrder,
    });
  }),
  updateOrderShippedToDelivered: asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ApiErr("can not find ordewr with this id", 404));
    }
    order.status = "Delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Deliverd updated",
      orderData: updatedOrder,
    });
  }),
};
