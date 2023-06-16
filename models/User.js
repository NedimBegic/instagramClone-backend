const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// it helps generate token and hash it
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      unique: true,
      required: [true, "Please add a nickname"],
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    description: String,
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      // select will not return the user password
      select: false,
    },
    numOfPosts: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//++++++++++ Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//+++++++++ Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ++++++++Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.virtual("post", {
  ref: "post",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});
module.exports = mongoose.model("user", UserSchema);
