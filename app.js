const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

const AppError = require("./utils/appError");

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

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  next(error); // By passing an arg in next express considers it as error and skips all the mniddleware in the stack and goes to error handling middleware.
});

app.use(globalErrorHandler);
module.exports = app;
