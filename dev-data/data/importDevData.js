// This is a script to import data from teh json file and load it up into our Database. This is run via cmd line as follows
// node path/filename --import or node path/filename --delete
//  import will load the data and delete will delete the data.

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../model/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB Connection Successful"));

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// Import Data into Database
const importData = async () => {
  try {
    await Tour.create(tours); // Passing the tours array
    console.log("Data Successfully Loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfully Deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  // [2] is the option we feed when starting the file with node
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
