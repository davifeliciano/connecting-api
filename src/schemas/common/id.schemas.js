import Joi from "joi";

const idSchema = Joi.number().positive().integer().required();

const idParamsSchema = Joi.object({ id: idSchema });

export { idSchema, idParamsSchema };
