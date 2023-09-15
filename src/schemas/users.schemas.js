import Joi from "joi";
import { usernameSchema } from "./auth.schemas.js";

const profileSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  bio: Joi.string().max(1500).default(null),
});

const usernameParamsSchema = Joi.object({
  username: usernameSchema,
});

export { profileSchema, usernameParamsSchema };
