import Joi from "joi";
import NotFoundError from "../errors/NotFoundError.js";

export default function validateUsername(req, res, next) {
  const { username } = req.params;

  const usernameSchema = Joi.string()
    .pattern(/^[\w-]{3,32}$/)
    .required();

  const { error, value } = usernameSchema.validate(username);

  if (error) {
    throw new NotFoundError("User not found");
  }

  res.locals.username = value;
  next();
}
