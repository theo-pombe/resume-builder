import { Document, model, Schema, Types } from "mongoose";
import { doHash } from "../utils/hashing.js";
import { toJSONPlugin } from "../plugins/toJSON.js";

export const UserRoles = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  resumes?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
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
    password: { type: String, required: true, trim: true, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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

UserSchema.plugin(toJSONPlugin);

const User = model<IUser>("User", UserSchema);

export default User;
