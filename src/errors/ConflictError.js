import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class ConflictError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = httpStatus.CONFLICT;
  }
}
