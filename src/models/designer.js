const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const designerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  location: {
    type: String,
  },
  profileIntro: {
    type: Boolean,
  },
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }],
  designDelivered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Design"
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  designPosted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Design"
  }],
  avgDeliveryTime: {
    type: String,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments"
  }],
  // exponentOfDesign: {
  //   type: String,
  // },
  // designation: {
  //   type: Array,
  //   // Graphic Designers | UI/UX Designers | Web Designers | 3D Modelers | Illustrator | Video Producers
  // },
  designerSpecialisation: String, // 'Art Illustration',
  ratings: [{
    type: mongoose.Schema.ObjectId,
    ref: "Rating",
  }],
designTools: [{
	type: String,
}],
  tags: [{
    type: String,
  }]

});

designerSchema.static.getDesignerUsername = async function (username){
  console.log("about to get designerId");
  const user = await User.findOne({ username, });
  console.log("user", username);
  const dner = await Designer.findOne({user: user._id});
  console.log("designer", dner);
  return dner
};

// designerSchema.virtual("email", {
//   ref: "User",
//   localField: "email",
//   foreignField: "email",
// });
//
//
// designerSchema.virtual("phoneNumber", {
//   ref: "User",
//   localField: "phoneName",
//   foreignField: "phoneName",
// });

const Designer = mongoose.model("Designer", designerSchema);
module.exports = Designer;
