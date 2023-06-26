var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dj3uyodvz",
  api_key: "955235792318767",
  api_secret: "Eertp4kTJO_6SP4Nlb67QRD69EM",
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};



module.exports = cloudinary;
