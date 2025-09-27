import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization?.split(" ")[1] ?? "";

  if (!authToken) return next(new Error("Authorization token is required"));

  try {
    const isVerifiedUser = verifyToken(authToken);
    if (!isVerifiedUser) return next(new Error("Not authorized"));

    const user = await User.findById(isVerifiedUser.id).lean();
    if (!user) return next(new Error("User doesn't exists"));
    req.user = { id: user.id, email: user.email, username: user.username };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
