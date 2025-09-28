import type { Request, Response, NextFunction } from "express";
import { ApiError, ValidationError } from "../utils/apiError.js";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;

    if (error instanceof ValidationError) {
      details = error.details;
    }
  }

  const stack =
    process.env.NODE_ENV === "development" ? (error as Error).stack : undefined;

  const resBody: Record<string, unknown> = {
    success: false,
    message,
  };

  if (details) resBody.details = details;
  if (stack) resBody.stack = stack;

  res.status(statusCode).json(resBody);
};

export default errorHandler;
