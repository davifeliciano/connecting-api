export default function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(422).send({ details });
    }

    res.locals.body = value;
    next();
  };
}
