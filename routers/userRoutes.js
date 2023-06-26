const express = require("express");

const Router = express.Router();
const auth = require("../controllers/authController");

const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  changePasswordValidator,
  changeLoggedPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validation/userValidation");

const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  addManagerToClinic,
  addManagerToClub,
  addManagerToPhyclinic,
  getAdminsAndManagers,
} = require("../controllers/userController");
////////////////////////////////////////////////////////////////////////////////////
//for all routes under
Router.use(auth.Protect);

//User
Router.get("/getMyData", getLoggedUserData, getUser);
Router.put(
  "/changeMyPassword",
  changeLoggedPasswordValidator,
  updateLoggedUserPassword
);
Router.put("/updateMyData", updateLoggedUserValidator, updateLoggedUserData);

/////////////////////////////////////////////////////////////////////////////////////
//Admin
//for all routes under
Router.use(auth.allowedTo("admin", "manager"));
Router.post("/", createUserValidator, createUser);
Router.post("/clubManager", addManagerToClub);
Router.post("/clinicManager", addManagerToClinic);
Router.post("/phyManager", addManagerToPhyclinic);
Router.get("/", getUsers);
Router.get("/adminsAndManagers", getAdminsAndManagers);

Router.get("/:id", getUserValidator, getUser);

Router.put(
  "/:id",

  updateUserValidator,
  updateUser
);

Router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);
Router.delete("/:id", deleteUserValidator, deleteUser);

module.exports = Router;
