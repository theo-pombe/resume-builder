import { Document, model, Schema } from "mongoose";

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
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export default User;
