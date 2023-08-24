import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class LoginError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "LoginError";
    this.statusCode = httpStatus.UNAUTHORIZED;
  }
}
