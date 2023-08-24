import httpStatus from "http-status";
import HttpError from "../errors/common/HttpError.js";

export default function errorHandler(req, res, next, err) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.error(err);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
}
