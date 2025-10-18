import { Document, Schema, type Types } from "mongoose";
import { toJSONPlugin } from "../../plugins/toJSON.js";

export const AcademicLevels = {
  DIPLOMA: "Diploma",
  ADVANCED_DIPLOMA: "Advanced Diploma",
  BACHELOR: "Bachelor's",
  PDG: "Postgraduate Diploma",
  MASTERS: "Master's",
  PHD: "Doctorate (PhD)",
} as const;

export const Classifications = {
  FIRST: "First Class",
  UPPER_SECOND: "Upper Second",
  LOWER_SECOND: "Lower Second",
  PASS: "Pass",
  FAIL: "Fail",
} as const;

export type AcademicLevel =
  (typeof AcademicLevels)[keyof typeof AcademicLevels];

export type Classification =
  (typeof Classifications)[keyof typeof Classifications];

interface IInstitution {
  name: string;
  location: string;
}

interface IAcademicGrade {
  classification: Classification;
  gpa: number;
}

export interface IAcademic extends Document {
  level: AcademicLevel;
  award: string;
  institution: IInstitution;
  startYear: number;
  endYear: number;
  grade: IAcademicGrade;
  certificate?: string;
  transcript?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const currentYear = new Date().getFullYear();

const InstitutionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const GradeSchema = new Schema(
  {
    classification: {
      type: String,
      required: true,
      enum: Object.values(Classifications),
    },
    gpa: {
      type: Number,
      required: true,
      min: [0, "GPA cannot be less than 0"],
      max: [5, "GPA cannot be more than 5"],
    },
  },
  { _id: false }
);

const AcademicQualificationSchema = new Schema<IAcademic>(
  {
    level: {
      type: String,
      required: true,
      enum: Object.values(AcademicLevels),
    },
    award: {
      type: String,
      required: true,
      trim: true,
    },
    institution: { type: InstitutionSchema, required: true },
    startYear: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) =>
          Number.isInteger(v) && v >= 1900 && v <= currentYear + 5,
        message: (props) => `${props.value} is not a valid start year`,
      },
    },
    endYear: {
      type: Number,
      required: true,
      validate: [
        {
          validator: (v: number) =>
            Number.isInteger(v) && v >= 1900 && v <= currentYear + 20,
          message: (props) => `${props.value} is not a valid end year`,
        },
        {
          // use function to access this.startYear
          validator: function (this: IAcademic, v: number) {
            return typeof this.startYear === "number" ? this.startYear <= v : true;
          },
          message: "End year must be greater than or equal to start year",
        },
      ],
    },
    grade: { type: GradeSchema, required: true },
    certificate: { type: String, trim: true },
    transcript: { type: String, trim: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

AcademicQualificationSchema.set("toJSON", { virtuals: true });
AcademicQualificationSchema.set("toObject", { virtuals: true });

AcademicQualificationSchema.plugin(toJSONPlugin);

export default AcademicQualificationSchema;
