import Joi from "joi";

export const updateAccountBodySchema = Joi.object({
  newUsername: Joi.string().trim().min(3).max(30).messages({
    "string.base": "newUsername must be a text.",
    "string.min": "newUsername must be at least 3 characters long.",
    "string.max": "newUsername must not exceed 30 characters.",
  }),
  newEmail: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }),
  newPassword: Joi.string().min(6).messages({
    "string.base": "newPassword must be a text.",
    "string.min": "Password must be at least 8 characters long.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
