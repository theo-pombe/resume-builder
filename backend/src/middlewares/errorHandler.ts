import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  const resBody: Record<string, any> = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    resBody.stack = error.stack;
  }

  res.status(statusCode).json(resBody);
};

export default errorHandler;
