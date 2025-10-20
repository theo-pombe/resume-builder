import Joi from "joi";
import {
  Divisions,
  SchoolAwards,
  SchoolLevels,
} from "../../models/sub-schemas/SchoolQualification.js";

const currentYear = new Date().getFullYear();

const divisionList = Object.values(Divisions).join(", ");
const levelList = Object.values(SchoolLevels).join(", ");
const awardList = Object.values(SchoolAwards).join(", ");

const schoolGradeSchema = Joi.object({
  division: Joi.string()
    .valid(...Object.values(Divisions))
    .messages({
      "any.only": `Division must be one of: ${divisionList}.`,
      "string.base": "Division must be a string.",
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
    "any.required": "School name is required.",
  }),
  location: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "School location must be a valid string.",
    "string.min": "School location must be at least 2 characters long.",
    "string.max": "School location must be no longer than 255 characters.",
    "any.required": "School location is required.",
  }),
});

export const addSchoolQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(SchoolLevels))
    .required()
    .messages({
      "any.required": "Level is required.",
      "any.only": `Level must be one of: ${levelList}.`,
    }),
  award: Joi.string()
    .trim()
    .valid(...Object.values(SchoolAwards))
    .required()
    .messages({
      "any.required": "Award is required.",
      "any.only": `Award must be one of: ${awardList}.`,
    }),
  school: schoolInfoSchema.required(),
  startYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 5)
    .required()
    .messages({
      "number.base": "Start year must be a valid number.",
      "number.integer": "Start year must be an integer.",
      "number.min": "Start year cannot be before 1900.",
      "number.max": `Start year cannot be after ${currentYear + 5}.`,
      "any.required": "Start year is required.",
    }),
  endYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 20)
    .required()
    .messages({
      "number.base": "End year must be a valid number.",
      "number.integer": "End year must be an integer.",
      "number.min": "End year cannot be before 1900.",
      "number.max": `End year cannot be after ${currentYear + 20}.`,
      "any.required": "End year is required.",
    })
    .custom((value: any, helpers: any) => {
      const startYear = helpers?.state?.ancestors?.[0]?.startYear;
      if (typeof startYear === "number" && value < startYear) {
        return helpers.message(
          "End year must be equal to or after Start year."
        );
      }
      return value;
    }),
  grade: schoolGradeSchema.optional(),
})
  .custom((obj: any, helpers: any) => {
    if (!obj.level || !obj.award) return obj;

    const mapping: Record<string, string> = {
      [SchoolLevels.PRIMARY]: SchoolAwards.PSLE,
      [SchoolLevels.OLEVEL]: SchoolAwards.CSEE,
      [SchoolLevels.ALEVEL]: SchoolAwards.ACSEE,
    };

    const expectedAward = mapping[obj.level as keyof typeof mapping];
    if (expectedAward && obj.award !== expectedAward) {
      return helpers.message(
        `When level is "${obj.level}", award must be "${expectedAward}".`
      );
    }
    return obj;
  })
  .required();

export const updateSchoolQualificationBodySchema = Joi.object({
  level: Joi.string()
    .valid(...Object.values(SchoolLevels))
    .messages({
      "any.only": `Level must be one of: ${levelList}.`,
      "string.base": "Level must be a valid string.",
    }),
  award: Joi.string()
    .trim()
    .valid(...Object.values(SchoolAwards))
    .messages({
      "any.only": `Award must be one of: ${awardList}.`,
      "string.base": "Award must be a valid string.",
    }),
  school: schoolInfoSchema.optional(),
  startYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 5)
    .messages({
      "number.base": "Start year must be a valid number.",
      "number.integer": "Start year must be an integer.",
      "number.min": "Start year cannot be before 1900.",
      "number.max": `Start year cannot be after ${currentYear + 5}.`,
    }),
  endYear: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear + 20)
    .messages({
      "number.base": "End year must be a valid number.",
      "number.integer": "End year must be an integer.",
      "number.min": "End year cannot be before 1900.",
      "number.max": `End year cannot be after ${currentYear + 20}.`,
    })
    .custom((value: any, helpers: any) => {
      const startYear = helpers?.state?.ancestors?.[0]?.startYear;
      if (typeof startYear === "number" && value < startYear) {
        return helpers.message(
          "End year must be equal to or after Start year."
        );
      }
      return value;
    }),
  grade: schoolGradeSchema.optional(),
})
  .optional()
  .custom((obj: any, helpers: any) => {
    if (obj.level && obj.award) {
      const mapping: Record<string, string> = {
        [SchoolLevels.PRIMARY]: SchoolAwards.PSLE,
        [SchoolLevels.OLEVEL]: SchoolAwards.CSEE,
        [SchoolLevels.ALEVEL]: SchoolAwards.ACSEE,
      };
      const expectedAward = mapping[obj.level as keyof typeof mapping];
      if (expectedAward && obj.award !== expectedAward) {
        return helpers.message(
          `When level is "${obj.level}", award must be "${expectedAward}".`
        );
      }
    }
    return obj;
  });
