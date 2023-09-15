import Joi from "joi";

const postSchema = Joi.object({
  caption: Joi.string().max(1500).required(),
});

const authorMessage =
  '"author" must have between 3 and 32 characters (letters, numbers, - and _ are allowed)';

const listPostsQuerySchema = Joi.object({
  following: Joi.boolean().default(false),
  author: Joi.string()
    .pattern(/^[\w-]{3,32}$/)
    .message(authorMessage)
    .default(false),
  startId: Joi.number().integer().positive().default(false),
  startTimestamp: Joi.date().default(false),
});

export { postSchema, listPostsQuerySchema };
