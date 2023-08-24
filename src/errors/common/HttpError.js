import httpStatus from "http-status";

export default class HttpError extends Error {
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;

  constructor(message) {
    super(message);
    this.name = "HttpError";
  }
}
