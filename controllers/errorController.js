const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  // Regex To extract the value between quotes
  const message = `Duplicate field value: ${value}. Please use another value!`;
  console.log(value);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Coming from AppError class for production only errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error
    console.log("ERROR!!!", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    console.log("dev");
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = { ...err }; //Making a shallow copy of the error
    if (err.name === "CastError") {
      // We use err to check instead of error because in shallow copy the non enumerable items are not copied and nmae is one of them.
      // handling Invalid ID errors
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) error = handleDuplicateErrorDB(error); // handling duplicate entry validator error
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
