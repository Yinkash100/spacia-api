const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Designer = require("../models/designer");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Even I can predict that password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    lastLogin: {
      type: Date,
    },
    online: {
      type: Boolean,
    },
  activated: {
      type: Boolean,
  }
  },

  {
    timestamps: true,
  }
);

userSchema.virtual("designer", {
  ref: "Designer",
  localField: "_id",
  foreignField: "basicDetails",
});

// return formatted user (without passwords and tokens)
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  // const newUserObject = {};
  //
  // newUserObject.username = userObject.username;
  //
  // return newUserObject;

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.name;

  return userObject;
};

// generate auth tokens
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// find a user (for login)
userSchema.statics.findByCredentials = async function (email, password) {
  // if(validator.isEmail(usernameOrEmail)){
  const user = await User.findOne({ email });
  // }
  if (!user) {
    throw new Error("invalid credentials, Please try again");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("invalid credentials, Please try again");
  }

  return user;
};

// Hash the plain text password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 9);
  }
  next();
});

// Delete users stuffs when user is removed

const User = mongoose.model("User", userSchema);
module.exports = User;
