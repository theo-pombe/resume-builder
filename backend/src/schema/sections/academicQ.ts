import Joi from "joi";
import {
  AcademicLevels,
  Classifications,
} from "../../models/sub-schemas/AcademicQualification.js";

const currentYear = new Date().getFullYear();

const institutionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "Institution name must be a valid string.",
    "string.min": "Institution name must be at least 2 characters long.",
    "string.max": "Institution name must be no longer than 255 characters.",
  }),
  location: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "Institution location must be a valid string.",
    "string.min": "Institution location must be at least 2 characters long.",
    "string.max": "Institution location must be no longer than 255 characters.",
  }),
});

export const academicGradeSchema = Joi.object({
  classification: Joi.string()
    .valid(...Object.values(Classifications))
    .required()
    .messages({
      "any.required": "Classification is required.",
      "any.only":
        "Classification must be one of: First Class, Upper Second, Lower Second, Pass, Fail.",
    }),
  gpa: Joi.number().min(0).max(5).precision(2).required().messages({
    "any.required": "GPA is required.",
    "number.base": "GPA must be a valid number.",
    "number.min": "GPA cannot be less than 0.",
    "number.max": "GPA cannot be more than 5.",
    "number.precision": "GPA must have at most 2 decimal places.",
  }),
});

export const addAcademicQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(AcademicLevels))
    .required()
    .messages({
      "any.required": "Level is required.",
      "any.only":
        "Level must be one of: Diploma, Advanced Diploma, Bachelor's, Postgraduate Diploma, Master's, Doctorate (PhD).",
    }),
  award: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "Award must be a valid string.",
    "string.min": "Award must be at least 2 characters long.",
    "string.max": "Award must be no longer than 255 characters.",
    "any.required": "Award is required.",
  }),
  institution: institutionSchema.required(),
  startYear: Joi.number()
    .integer()
    .min(1900)
    .required()
    .messages({
      "number.base": "Start year must be a valid number.",
      "number.min": "Start year cannot be before 1900.",
      "number.max": `Start year cannot be after ${currentYear}.`,
      "any.required": "Start year is required.",
    }),
  endYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 10)
    .required()
    .custom((value: any, helpers: any) => {
      const { startYear } = helpers?.state?.ancestors[0] ?? {};
      if (startYear && value < startYear) {
        return helpers.message("End year must be equal to or after Start year");
      }
      return value;
    })
    .messages({
      "number.base": "End year must be a valid number.",
      "number.min": "End year cannot be before 1900.",
      "number.max": `End year cannot be after ${currentYear + 10}.`,
      "any.required": "End year is required.",
    }),
  grade: academicGradeSchema.required(),
}).required();

export const updateAcademicQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(AcademicLevels))
    .messages({
      "any.only":
        "Level must be one of: Diploma, Advanced Diploma, Bachelor's, Postgraduate Diploma, Master's, Doctorate (PhD).",
    }),
  award: Joi.string().trim().min(2).max(255).messages({
    "string.base": "Award must be a valid string.",
    "string.min": "Award must be at least 2 characters long.",
    "string.max": "Award must be no longer than 255 characters.",
  }),
  institution: institutionSchema,
  startYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear)
    .messages({
      "number.base": "Start year must be a valid number.",
      "number.min": "Start year cannot be before 1900.",
      "number.max": `Start year cannot be after ${currentYear}.`,
    }),
  endYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 10)
    .custom((value: any, helpers: any) => {
      const { startYear } = helpers?.state?.ancestors[0] ?? {};
      if (startYear && value < startYear) {
        return helpers.message("End year must be equal to or after Start year");
      }
      return value;
    })
    .messages({
      "number.base": "End year must be a valid number.",
      "number.min": "End year cannot be before 1900.",
      "number.max": `End year cannot be after ${currentYear + 10}.`,
    }),
  grade: academicGradeSchema,
}).optional();
