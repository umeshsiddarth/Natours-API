const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => console.log("Connected"));

// Creating a Schema
const tourSchema = new mongoose.Schema({
  // name: String, // Basic way of defining
  name: {
    type: String,
    required: [true, "A tour must have a name"], // true and error, this is called validator
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

// Creating a Model
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "Dharamshala",
  price: 100,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
