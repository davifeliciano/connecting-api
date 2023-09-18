import Joi from "joi";
import authorSchema from "./common/author.schemas.js";
import paginationQuerySchema from "./common/pagination.schemas.js";

const postSchema = Joi.object({
  caption: Joi.string().max(1500).required(),
});

const listPostsQuerySchema = Joi.object({
  ...paginationQuerySchema,
  following: Joi.boolean().default(false),
  author: authorSchema,
});

export { postSchema, listPostsQuerySchema };
