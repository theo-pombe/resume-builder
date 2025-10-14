import Joi from "joi";
import {
  DISABILITIES,
  GENDERS,
  MARITAL_STATUSES,
} from "../../models/sections/PersonalInfo.js";

export const addPersonalInfoSchema = Joi.object({
  fullName: Joi.string().required().trim().messages({
    "string.base": "Full name must be a text.",
    "string.empty": "Full name is required.",
  }),
  gender: Joi.string()
    .valid(...Object.values(GENDERS))
    .required()
    .trim()
    .messages({
      "any.only": "Gender must be either 'male' or 'female'.",
      "string.base": "Gender must be a text.",
      "string.empty": "Gender is required.",
    }),
  dateOfBirth: Joi.date().required().less("now").messages({
    "date.base": "Date of birth must be a valid date.",
    "date.less": "Date of birth cannot be in the future.",
    "any.required": "Date of birth is required.",
  }),
  nationality: Joi.string().required().trim().messages({
    "string.base": "Nationality must be a text.",
    "string.empty": "Nationality is required.",
  }),
  placeOfDomicile: Joi.string().optional().trim().messages({
    "string.base": "Place of Domicile must be a text.",
  }),
  maritalStatus: Joi.string()
    .valid(...Object.values(MARITAL_STATUSES))
    .optional()
    .trim()
    .messages({
      "string.base": "Marital status must be a text.",
      "any.only":
        "Marital status must be one of: single, married, divorced, widowed.",
    }),
  disabilities: Joi.array()
    .items(Joi.string().valid(...Object.values(DISABILITIES)))
    .default([DISABILITIES.NONE])
    .custom((value, helpers) => {
      if (value.includes(DISABILITIES.NONE) && value.length > 1) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid":
        "If 'none' is selected, no other disabilities can be selected.",
      "array.base": "Disabilities must be a list of strings.",
    }),
  email: Joi.string()
    .required()
    .trim()
    .lowercase()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/)
    .messages({
      "string.base": "Email must be a text.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
      "string.pattern.base": "Please provide a valid email address.",
    }),
  phone: Joi.string()
    .required()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .messages({
      "string.base": "Phone must be a text.",
      "string.empty": "Phone is required.",
      "any.required": "Phone is required.",
      "string.pattern.base":
        "Phone number must be valid (7–15 digits, optional + at start).",
    }),
  physicalAddress: Joi.string().required().trim().messages({
    "string.base": "Address must be a text.",
    "string.empty": "Address is required.",
  }),
});

export const editPersonalInfoSchema = Joi.object({
  fullName: Joi.string().optional().trim().messages({
    "string.base": "Full name must be a text.",
  }),
  gender: Joi.string()
    .valid(...Object.values(GENDERS))
    .optional()
    .trim()
    .messages({
      "any.only": "Gender must be either 'male' or 'female'.",
      "string.base": "Gender must be a text.",
    }),
  dateOfBirth: Joi.date().optional().less("now").messages({
    "date.base": "Date of birth must be a valid date.",
    "date.less": "Date of birth cannot be in the future.",
  }),
  nationality: Joi.string().optional().trim().messages({
    "string.base": "Nationality must be a text.",
  }),
  placeOfDomicile: Joi.string().optional().trim().messages({
    "string.base": "Place of Domicile must be a text.",
  }),
  maritalStatus: Joi.string()
    .valid(...Object.values(MARITAL_STATUSES))
    .optional()
    .trim()
    .messages({
      "string.base": "Marital status must be a text.",
      "any.only":
        "Marital status must be one of: single, married, divorced, widowed.",
    }),
  disabilities: Joi.array()
    .items(Joi.string().valid(...Object.values(DISABILITIES)))
    .custom((value, helpers) => {
      if (value.includes("none") && value.length > 1) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid":
        "If 'none' is selected, no other disabilities can be selected.",
      "array.base": "Disabilities must be a list of strings.",
    }),
  email: Joi.string()
    .optional()
    .trim()
    .lowercase()
    .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/)
    .messages({
      "string.base": "Email must be a text.",
      "string.pattern.base": "Please provide a valid email address.",
    }),
  phone: Joi.string()
    .optional()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .messages({
      "string.base": "Phone must be a text.",
      "string.pattern.base":
        "Phone number must be valid (7–15 digits, optional + at start).",
    }),
  physicalAddress: Joi.string().optional().trim().messages({
    "string.base": "Address must be a text.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });
