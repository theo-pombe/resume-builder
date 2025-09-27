import { Document, model, Schema, Types } from "mongoose";
import { toJSONPlugin } from "../plugins/toJSON.js";

interface IDeclaration {
  statement?: string;
  signature?: string;
  date?: Date;
}

interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  summary: string;
  declaration: IDeclaration;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true, default: "" },
    declaration: {
      type: {
        statement: { type: String, trim: true, default: "" },
        signature: { type: String, trim: true, default: "" },
        date: { type: Date },
      },
      default: {},
    },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ResumeSchema.virtual("isActive").get(function () {
  return !this.deletedAt;
});

ResumeSchema.statics.findActive = function () {
  return this.find({ deletedAt: null });
};

ResumeSchema.plugin(toJSONPlugin);

ResumeSchema.set("toJSON", { virtuals: true });
ResumeSchema.set("toObject", { virtuals: true });

const Resume = model<IResume>("Resume", ResumeSchema);

export default Resume;
