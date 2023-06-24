const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const clincRoute = require("./clincRoutes");
const clubRoute = require("./clubRoutes");
const phyclincRoute = require("./phyRoutes");
const subRoute = require("./SubsRoutes ");
const ExerRoute = require("./exerciseRoutes");
const feedingRoute = require("./feedingRoutes");
const productRoute = require("./productRoutes");
const cartRoute = require("./cartRoutes");
const sliderRoute = require("./sliderRoutes");
const notificationRoute = require("./notificationRoutes");

const Routes = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/clinc", clincRoute);
  app.use("/api/v1/phyclinic", phyclincRoute);
  app.use("/api/v1/club", clubRoute);
  app.use("/api/v1/subs", subRoute);
  app.use("/api/v1/exercises", ExerRoute);
  app.use("/api/v1/feeding", feedingRoute);
  app.use("/api/v1/prod", productRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/slider", sliderRoute);
  app.use("/api/v1/notification", notificationRoute);
};

module.exports = Routes;
