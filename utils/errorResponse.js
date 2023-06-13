// error class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // inherit and switch message property
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
