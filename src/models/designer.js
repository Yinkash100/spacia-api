const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const designerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  // basicDetails: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "User",
  // },
  name: {
    type: String,
    ref: 'User'
  },
  location: {
    type: String,
  },
  profileIntro: {
    type: Boolean,
  },
  designs: [{

    type: mongoose.Schema.Types.ObjectId,
    ref: "Design"
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  points: {
    type: Number,
  },
  deliveryTime: {
    type: String,
  },
  designDelivered: [{
    type: mongoose.Schema.ObjectId,
    ref: "Design",
  }],
  exponentOfDesign: {
    type: String,
  },
  designation: {
    type: Array,
    // Graphic Designers | UI/UX Designers | Web Designers | 3D Modelers | Illustrator | Video Producers
  },
  ratings: [{
    type: mongoose.Schema.ObjectId,
    ref: "Rating",
  }]

});

designerSchema.virtual("email", {
  ref: "User",
  localField: "email",
  foreignField: "email",
});


designerSchema.virtual("phoneNumber", {
  ref: "User",
  localField: "phoneName",
  foreignField: "phoneName",
});

const Designer = mongoose.model("Designer", designerSchema);
module.exports = Designer;
