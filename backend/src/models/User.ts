import { Document, model, Schema, Types } from "mongoose";
import { doHash } from "../utils/hashing.js";
import { toJSONPlugin } from "../plugins/toJSON.js";

export const UserRoles = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string | null;
  resumes?: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },
    email: { type: String, required: true, unique: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
    },
    avatar: { type: String, trim: true },
    password: { type: String, required: true, trim: true, select: false },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// hash the password before saving it
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await doHash(this.password, 10);
  next();
});

UserSchema.virtual("resumes", {
  ref: "Resume",
  localField: "_id",
  foreignField: "user",
});

UserSchema.virtual("isActive").get(function () {
  return !this.deletedAt;
});

UserSchema.statics.findActive = function () {
  return this.find({ deletedAt: null });
};

UserSchema.plugin(toJSONPlugin);

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    delete ret.password;
  },
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = model<IUser>("User", UserSchema);

export default User;
