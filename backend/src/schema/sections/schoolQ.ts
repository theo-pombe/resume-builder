import Joi from "joi";
import {
  Divisions,
  SchoolAwards,
  SchoolLevels,
} from "../../models/sub-schemas/SchoolQualification.js";

const currentYear = new Date().getFullYear();

const schoolGradeSchema = Joi.object({
  division: Joi.string()
    .valid(...Object.values(Divisions))
    .messages({
      "any.only": "Division must be one of: I, II, III, IV, 0.",
    }),
  points: Joi.number().min(0).messages({
    "number.base": "Points must be a valid number.",
    "number.min": "Points cannot be negative.",
  }),
}).allow(null);

const schoolInfoSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "School name must be a valid string.",
    "string.min": "School name must be at least 2 characters long.",
    "string.max": "School name must be no longer than 255 characters.",
  }),
  location: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "School location must be a valid string.",
    "string.min": "School location must be at least 2 characters long.",
    "string.max": "School location must be no longer than 255 characters.",
  }),
});

export const addSchoolQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(SchoolLevels))
    .required()
    .messages({
      "any.required": "Level is required.",
      "any.only": "Level must be one of: Primary, O-Level, A-Level.",
    }),
  award: Joi.string()
    .trim()
    .valid(...Object.values(SchoolAwards))
    .required()
    .messages({
      "any.required": "Award is required.",
      "any.only": "Award must be one of: PSLE, CSEE, or ACSEE.",
    }),
  school: schoolInfoSchema.required(),
  startYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear)
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
  grade: schoolGradeSchema.optional(),
}).required();

export const updateSchoolQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(SchoolLevels))
    .messages({
      "any.only": "Level must be one of: Primary, O-Level, A-Level.",
    }),
  award: Joi.string()
    .trim()
    .valid(...Object.values(SchoolAwards))
    .messages({
      "any.only": "Award must be one of: PSLE, CSEE, ACSEE.",
    }),
  school: schoolInfoSchema,
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
  grade: schoolGradeSchema.optional(),
}).optional();
