import httpStatus from "http-status";

export default function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ details });
    }

    res.locals.params = value;
    next();
  };
}
