class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // this.message is not set because we already set the message property to its parent class Error.

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // This is to check whether it is an Operational error or some other error.

    Error.captureStackTrace(this, this.constructor); // To check the error origin point.
  }
}

module.exports = AppError;
