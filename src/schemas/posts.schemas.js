import Joi from "joi";

const postSchema = Joi.object({
  caption: Joi.string().max(1500).required(),
});

export { postSchema };
