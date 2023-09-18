import Joi from "joi";
import { idSchema } from "./common/id.schemas.js";
import paginationQuerySchema from "./common/pagination.schemas.js";
import authorSchema from "./common/author.schemas.js";

const commentSchema = Joi.object({
  postId: Joi.number().positive().integer().required(),
  content: Joi.string().max(256).required(),
});

const listCommentsQuerySchema = Joi.object({
  ...paginationQuerySchema,
  postId: idSchema.optional(),
  author: authorSchema,
});

export { commentSchema, listCommentsQuerySchema };
