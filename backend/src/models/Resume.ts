import { Document, model, Schema, Types } from "mongoose";
import { toJSONPlugin } from "../plugins/toJSON.js";

interface IDeclaration {
  statement?: string;
  signature?: string;
  date?: Date;
}

export interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  summary: string;
  avatar?: string;
  displayAvatar?: string;
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
    avatar: { type: String, trim: true },
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

ResumeSchema.index(
  { user: 1, title: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

ResumeSchema.virtual("displayAvatar").get(function () {
  // `this` refers to the Resume document
  // `this.user` must be populated to access user.avatar
  if (!this.user) return this.avatar || null;

  return this.avatar || (this.user as any).avatar || null;
});

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
