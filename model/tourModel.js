const mongoose = require("mongoose");

// Creating a Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // This will cut the whitespaces on the front and back of the text
    required: [true, "A tour must have a name"],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  discount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a image link"],
  },
  images: [String], // An array of strings can be represented in such a way
  createdAt: {
    type: Date,
    default: Date.now(), // The millisec data will be automatically converted to today's date in mongo
    // select: false,
    // This is to avoid showign this particular field on query
  },
  startDates: [Date],
});

// Creating a model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
