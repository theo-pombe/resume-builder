import type { Document, Types } from "mongoose";
import { model, Schema } from "mongoose";
import { toJSONPlugin } from "../../plugins/toJSON.js";

export const GENDERS = {
  MALE: "male",
  FEMALE: "female",
} as const;

export const MARITAL_STATUSES = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
} as const;

export const DISABILITIES = {
  NONE: "none",
  VISUAL: "visual",
  HEARING: "hearing",
  MOBILITY: "mobility",
  COGNITIVE: "cognitive",
  OTHER: "other",
} as const;

export type GENDER = (typeof GENDERS)[keyof typeof GENDERS];

export type MARITAL_STATUS =
  (typeof MARITAL_STATUSES)[keyof typeof MARITAL_STATUSES];

export type DISABILITY = (typeof DISABILITIES)[keyof typeof DISABILITIES];

export interface IPersonalInfo extends Document {
  resume: Types.ObjectId;
  fullName: string;
  gender: GENDER;
  dateOfBirth: Date;
  nationality?: string;
  placeOfDomicile?: string;
  maritalStatus?: MARITAL_STATUS;
  disabilities: DISABILITY[];
  email: string;
  phone: string;
  physicalAddress: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const PersonalInfoSchema = new Schema<IPersonalInfo>(
  {
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: Object.values(GENDERS) },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (d: Date) {
          if (!d) return true;
          const now = new Date();
          if (d > now) return false;
          const age = now.getFullYear() - d.getFullYear();
          if (age > 100) return false;
          return true;
        },
        message: "dateOfBirth must be a valid date not in the future.",
      },
    },
    nationality: { type: String, trim: true },
    placeOfDomicile: { type: String, trim: true },
    maritalStatus: { type: String, enum: Object.values(MARITAL_STATUSES) },
    disabilities: {
      type: [String],
      enum: Object.values(DISABILITIES),
      default: [DISABILITIES.NONE],
      validate: {
        validator: function (arr: unknown) {
          if (!Array.isArray(arr)) return false;
          if (arr.includes(DISABILITIES.NONE) && arr.length > 1) return false;
          return true;
        },
        message:
          "If 'none' is selected, no other disabilities can be selected.",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [
        /^\+?[0-9]{7,15}$/,
        "Please provide a valid phone number (7-15 digits, optional + at start)",
      ],
    },
    physicalAddress: { type: String, required: true, trim: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

PersonalInfoSchema.set("toJSON", { virtuals: true });
PersonalInfoSchema.set("toObject", { virtuals: true });

PersonalInfoSchema.plugin(toJSONPlugin);

const PersonalInfo = model<IPersonalInfo>(
  "PersonalInformation",
  PersonalInfoSchema
);

export default PersonalInfo;
