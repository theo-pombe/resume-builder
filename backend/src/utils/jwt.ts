import jwt, { type SignOptions } from "jsonwebtoken";
import type { IUser } from "../models/User.js";

export type JWTExpiration =
  | "30s"
  | "1m"
  | "5m"
  | "10m"
  | "30m"
  | "1h"
  | "2h"
  | "6h"
  | "12h"
  | "1d"
  | "7d"
  | "30d";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION! as JWTExpiration;

export const generateToken = (user: IUser): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRATION };

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
