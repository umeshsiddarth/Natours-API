const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello! I am the Server...", API_Name: "Natours" });
});

app.post("/", (req, res) => {
  res.send("You cannot post to this endpoint...");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
