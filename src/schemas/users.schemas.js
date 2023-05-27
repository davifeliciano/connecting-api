import Joi from "joi";

const profileSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  bio: Joi.string().max(1500).default(null),
});

export { profileSchema };
