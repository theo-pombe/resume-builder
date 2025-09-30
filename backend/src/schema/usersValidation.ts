import Joi from "joi";

export const EditUserBodySchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).messages({
    "string.base": "Username must be a text.",
    "string.empty": "Username cannot be empty.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
  }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }),
  role: Joi.string().valid("user", "admin").messages({
    "any.only": "Role must be either 'user' or 'admin'.",
    "string.base": "Role must be a text.",
    "string.empty": "Role cannot be empty.",
  }),
  avatar: Joi.string().uri().messages({
    "string.uri": "Image must be a valid URL",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });
