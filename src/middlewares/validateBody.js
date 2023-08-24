import httpStatus from "http-status";

export default function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ details });
    }

    res.locals.body = value;
    next();
  };
}
