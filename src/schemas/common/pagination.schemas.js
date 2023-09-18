import Joi from "joi";

const paginationQuerySchema = {
  startId: Joi.number().integer().positive().default(false),
  startTimestamp: Joi.date().default(false),
};

export default paginationQuerySchema;
