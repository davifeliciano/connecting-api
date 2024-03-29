import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class RefreshTokenReuseError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "RefreshTokenReuseError";
    this.statusCode = httpStatus.UNAUTHORIZED;
  }
}
