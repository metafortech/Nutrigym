const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, "qawsedrftgyhujikol", {
    expiresIn: "90d",
  });

module.exports = generateToken;
