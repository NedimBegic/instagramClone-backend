const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  // we take all properties of err from parametar
  let error = { ...err };
  // we take the message from error
  error.message = err.message;
  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message || "Server Error" });
};

module.exports = errorHandler;
