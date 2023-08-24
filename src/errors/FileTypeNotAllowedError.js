import httpStatus from "http-status";
import HttpError from "./common/HttpError.js";

export default class FileTypeNotAllowedError extends HttpError {
  constructor(message) {
    super(message);
    this.name = "FileTypeNotAllowedError";
    this.statusCode = httpStatus.UNPROCESSABLE_ENTITY;
  }
}
