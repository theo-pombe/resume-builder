import { Document, model, Schema, type Types } from "mongoose";
import AcademicQualificationSchema, {
  type IAcademic,
} from "../sub-schemas/AcademicQualification.js";
import SchoolQualificationSchema, {
  type ISchool,
} from "../sub-schemas/SchoolQualification.js";

export interface IEducation extends Document {
  resume: Types.ObjectId;
  schoolQualifications: ISchool[];
  academicQualifications: IAcademic[];
  createdAt: Date;
  updatedAt: Date;
}

const EducationBackgroundSchema = new Schema<IEducation>(
  {
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true, // index for lookups
    },
    schoolQualifications: {
      type: [SchoolQualificationSchema],
      required: true,
      default: [],
      validate: {
        validator: function (v: any[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one school qualification is required",
      },
    },
    academicQualifications: {
      type: [AcademicQualificationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

EducationBackgroundSchema.index({ resume: 1 }, { unique: true });

const EducationBackground = model<IEducation>(
  "EducationBackground",
  EducationBackgroundSchema
);

export default EducationBackground;
