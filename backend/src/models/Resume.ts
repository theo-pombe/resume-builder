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
  isActive: boolean;
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
      statement: { type: String, trim: true, default: "" },
      signature: { type: String, trim: true, default: "" },
      date: { type: Date },
      default: {},
    },
    isActive: { type: Boolean, default: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ResumeSchema.plugin(toJSONPlugin);

const Resume = model<IResume>("Resume", ResumeSchema);

export default Resume;
