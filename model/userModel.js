const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name should not be empty"],
    maxlength: [40, "Name should not exceed 40 characters"],
    minlength: [5, "name should atleast have 5 characters"],
  },

  email: {
    type: String,
    required: [true, "Email should not be empty"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter valid email id"],
  },

  photo: {
    type: String, // Only the path will be stored
  },

  password: {
    type: String,
    required: [true, "Passowrd is muust to login/create account"],
    minlength: 8,
  },

  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Imp This only works on CREATE or SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords doesn't match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // hash is async function
  this.password = await bcrypt.hash(this.password, 12);
  // We use salt length/cost value (2nd param), the random number to be added and hashed. The default cost value 10 but because of powerful computers available these days we use 12
  this.confirmPassword = undefined;
  // We don't want confirm password anymore in database, it is there just to help users.
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
