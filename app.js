const fs = require("fs");
const express = require("express");
const app = express(); // Created to get the bunch of values we get to work with upon calling express.
const port = 3000;

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello! I am the Server...", API_Name: "Natours" });
// });

// Reading Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
console.log(tours);
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours
      // endpoint : variable
    }
  })
});

app.post("/", (req, res) => {
  res.send("You can post to this endpoint...");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
