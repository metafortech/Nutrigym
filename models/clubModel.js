const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
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
    manager: { type: mongoose.Schema.ObjectId, ref: "User" },
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
    },
    subscribes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    offers: [
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
    clubProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.URL_BASE}/clubs/${doc.image}`;
    doc.image = imageUrl;
  }
};

//middleware get image url
//findOne  findAll Update
clubSchema.post("init", (doc) => {
  setImageURL(doc);
});
//create
clubSchema.post("save", (doc) => {
  setImageURL(doc);
});

const clubModel = mongoose.model("Club", clubSchema);

module.exports = clubModel;
