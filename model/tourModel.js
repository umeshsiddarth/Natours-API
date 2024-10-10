const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

// Creating a Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // This will cut the whitespaces on the front and back of the text
      required: [true, "A tour must have a name"],
      unique: true,
      maxlength: [40, "A tour name should not exceed 40 characters"],
      minlength: [7, "A tour name should atleast have 7 characters"],
      // validate: [ // Not useful here because it doesn't allow spaces, so commented out
      //   validator.isAlpha(), // Validate whether it only has alphabets
      //   "Tour name should only contain alphabets",
      // ],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium or difficult",
      }, // Validator for Strings
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //this keyword in the validators will only be available when we create a new document and it will not work when we try to update an existing document.
        },
        message:
          "Discount price ({VALUE}) should be less than the regular price",
        // ({VALUE}) is the value from the given input and in mongoose we can gain access to it this way
      },
    },
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: The pre middleware runs before .save() and .create()
// The save used here is called the hook
// We can use multiple middleware of the same document type, like we can tun 2 .pre middlewares
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// The post middleware runs after the doc is saved and we get access to the doc
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// We can use such middlewares to segreagte member and non member packages
// For the middleware to function for all the queries starting with find we can use regex as /^find/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // To find the execution time we can use the combionation of pre and post middlewares
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE: We are using it here to avoid the secret tour from aggregation pipeline
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
});
// Creating a model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
