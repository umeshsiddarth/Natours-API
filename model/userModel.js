const mongoose = require("mongoose");
const validator = require("validator");

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
      // Imp This only works with SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
