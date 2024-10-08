const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express(); // Created to get the bunch of methods we get to work with upon calling express.

// Adding Middleware
app.use(express.json());

// Adding 3rd Party Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to serve static files
app.use(express.static(`${__dirname}/public`));

// Adding custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
