import Joi from "joi";
import mongoose from "mongoose";

export const objectId = (value: any, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const paramsWithIDsSchema = Joi.object({
  resumeId: Joi.string().custom(objectId).messages({
    "string.base": "ID must be a string",
    "any.invalid": "ID must be a valid ObjectId",
  }),
  id: Joi.string().custom(objectId).messages({
    "string.base": "ID must be a string",
    "any.invalid": "ID must be a valid ObjectId",
  }),
  username: Joi.string().custom(objectId).messages({
    "string.base": "ID must be a string",
    "any.invalid": "ID must be a valid ObjectId",
  }),
}).or("id", "resumeId", "username");
