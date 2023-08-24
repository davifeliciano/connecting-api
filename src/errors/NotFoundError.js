import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class NotFoundError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = httpStatus.NOT_FOUND;
  }
}
