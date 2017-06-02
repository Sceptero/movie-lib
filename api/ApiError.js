module.exports = class ApiError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
};
