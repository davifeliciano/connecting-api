import httpStatus from "http-status";
import Joi from "joi";

export default function validateListPostsParams(req, res, next) {
  const authorMessage =
    '"author" must have between 3 and 32 characters (letters, numbers, - and _ are allowed)';

  const schema = Joi.object({
    following: Joi.boolean().default(false),
    author: Joi.string()
      .pattern(/^[\w-]{3,32}$/)
      .message(authorMessage)
      .default(false),
    startId: Joi.number().integer().positive().default(false),
    startTimestamp: Joi.date().default(false),
  });

  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ details });
  }

  res.locals.listOptions = value;
  next();
}
