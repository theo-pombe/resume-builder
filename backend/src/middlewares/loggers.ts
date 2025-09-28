import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

/**
 * Logs all incoming requests with status and duration
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `[Request] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - Body: ${JSON.stringify(
        req.body
      )}`
    );
  });

  next();
};

/**
 * Logs errors caught by errorHandler
 */
export const errorLogger = (
  error: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (error instanceof Error) {
    logger.error(`[Error] ${error.name}: ${error.message}\n${error.stack}`);
  } else {
    logger.error(`[Error] Non-error thrown: ${JSON.stringify(error)}`);
  }
  next(error); // Pass along to errorHandler
};
