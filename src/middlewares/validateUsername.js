import Joi from "joi";

export default function validateUsername(req, res, next) {
  const { username } = req.params;

  const usernameSchema = Joi.string()
    .pattern(/^[\w-]{3,32}$/)
    .required();

  const { error, value } = usernameSchema.validate(username);

  if (error) {
    return res.sendStatus(404);
  }

  res.locals.username = value;
  next();
}
