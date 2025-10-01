import Joi from "joi";

// Common declaration schema
const declarationSchema = Joi.object({
  statement: Joi.string().trim().allow("").messages({
    "string.base": "Statement must be a text.",
  }),
  signature: Joi.string().trim().allow("").messages({
    "string.base": "Signature must be a text.",
  }),
  date: Joi.string()
    .trim()
    .pattern(/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Date must be in DD/MM/YYYY format.",
    }),
});

// CREATE schema
export const createResumeBodySchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a text.",
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),
  summary: Joi.string().trim().allow("").required().messages({
    "string.base": "Summary must be a text.",
    "any.required": "Summary is required.",
  }),
  declaration: declarationSchema.optional(),
});

// UPDATE schema
export const updateResumeBodySchema = Joi.object({
  title: Joi.string().trim().optional().messages({
    "string.base": "Title must be a text.",
  }),
  summary: Joi.string().trim().optional().messages({
    "string.base": "Summary must be a text.",
  }),
  declaration: declarationSchema.optional(),
});
