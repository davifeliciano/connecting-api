import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class ForbbidenError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "ForbbidenError";
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}
