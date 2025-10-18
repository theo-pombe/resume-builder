import { Document, Schema, type Types } from "mongoose";
import { toJSONPlugin } from "../../plugins/toJSON.js";

export const SchoolLevels = {
  PRIMARY: "Primary",
  OLEVEL: "O-Level",
  ALEVEL: "A-Level",
} as const;

export const SchoolAwards = {
  PSLE: "Primary School Leaving Examination (PSLE)",
  CSEE: "The Certificate of Secondary Education Examination (CSEE)",
  ACSEE: "Advanced Certificate of Secondary Education Examination (ACSEE)",
} as const;

export const Divisions = {
  ONE: "I",
  TWO: "II",
  THREE: "III",
  FOUR: "IV",
  ZERO: "0",
} as const;

export type SchoolLevel = (typeof SchoolLevels)[keyof typeof SchoolLevels];

export type SchoolAward = (typeof SchoolAwards)[keyof typeof SchoolAwards];

export type Division = (typeof Divisions)[keyof typeof Divisions];

interface ISchoolInfo {
  name: string;
  location: string;
}

interface ISchoolGrade {
  division: Division;
  points: number;
}

export interface ISchool extends Document {
  level: SchoolLevel;
  award: SchoolAward;
  school: ISchoolInfo;
  startYear: number;
  endYear: number;
  grade?: ISchoolGrade | null;
  certificate?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const currentYear = new Date().getFullYear();

const SchoolInfoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SchoolGradeSchema = new Schema(
  {
    division: {
      type: String,
      trim: true,
      enum: Object.values(Divisions),
    },
    points: { type: Number, min: 0 },
  },
  { _id: false }
);

const SchoolQualificationSchema = new Schema<ISchool>(
  {
    level: { type: String, enum: Object.values(SchoolLevels), required: true },
    award: { type: String, required: true, enum: Object.values(SchoolAwards) },
    school: { type: SchoolInfoSchema, required: true },
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
          validator: function (this: ISchool, v: number) {
            return typeof this.startYear === "number" ? this.startYear <= v : true;
          },
          message: "End year must be greater than or equal to start year",
        },
      ],
    },
    // grade is optional and can be null (e.g., primary with no formal division)
    grade: { type: SchoolGradeSchema, default: null },
    certificate: { type: String, trim: true, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

SchoolQualificationSchema.set("toJSON", { virtuals: true });
SchoolQualificationSchema.set("toObject", { virtuals: true });

SchoolQualificationSchema.plugin(toJSONPlugin);

export default SchoolQualificationSchema;
