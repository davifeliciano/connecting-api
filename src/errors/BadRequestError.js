import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class BadRequest extends HttpError {
  constructor(message) {
    super(message);
    this.name = "BadRequest";
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}
