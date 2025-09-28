import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import User, { type UserRole } from "../models/User.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization?.split(" ")[1] ?? "";

  if (!authToken)
    return next(new BadRequestError("Authorization token is required"));

  try {
    const isVerifiedUser = verifyToken(authToken);
    if (!isVerifiedUser) return next(new UnauthorizedError("Not authorized"));

    const user = await User.findById(isVerifiedUser.id).lean();
    if (!user) return next(new NotFoundError("User doesn't exists"));
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError("Not authenticated"));

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError("You are not authorized to perform this action")
      );
    }

    next();
  };
