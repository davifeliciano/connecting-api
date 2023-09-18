import Joi from "joi";

const authorMessage =
  '"author" must have between 3 and 32 characters (letters, numbers, - and _ are allowed)';

const authorSchema = Joi.string()
  .pattern(/^[\w-]{3,32}$/)
  .message(authorMessage)
  .default(false);

export default authorSchema;
