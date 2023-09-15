import Joi from "joi";

const idParamsSchema = Joi.object({
  id: Joi.number().positive().integer().required(),
});

export default idParamsSchema;
