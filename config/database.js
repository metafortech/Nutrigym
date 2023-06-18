const mongoose = require("mongoose");

//CONNECT TO DB
const DBconnection = () => {
  mongoose.connect("mongodb+srv://nutriGym:lHQjk74v4caju5gM@cluster0.15cjlmc.mongodb.net/test").then((conn) => {
    console.log(`DataBase connected ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.error(`DataBase Error ${err}`);
  //   process.exit(1);
  // });
};

module.exports = DBconnection;
