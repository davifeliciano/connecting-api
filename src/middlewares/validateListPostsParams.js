import Joi from "joi";

export default function validateListPostsParams(req, res, next) {
  const schema = Joi.object({
    following: Joi.boolean().default(false),
    startId: Joi.number().integer().positive().default(false),
    startTimestamp: Joi.date().default(false),
  });

  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return res.status(422).send({ details });
  }

  res.locals.listOptions = value;
  next();
}
