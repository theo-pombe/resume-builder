import type { Request, Response, NextFunction } from "express";

// Middleware to normalize multipart/form-data to JSON
export const normalizeUpdateUserBody = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Only run for multipart/form-data (req.body may be empty before multer)
  if (req.body && Object.keys(req.body).length > 0) {
    const normalizedBody: Record<string, any> = {};

    for (const key in req.body) {
      const value = req.body[key];

      // Try to parse numbers and booleans automatically
      if (value === "true") normalizedBody[key] = true;
      else if (value === "false") normalizedBody[key] = false;
      else if (!isNaN(Number(value))) normalizedBody[key] = Number(value);
      else normalizedBody[key] = value;
    }

    req.body = normalizedBody;
  }

  next();
};

export const normalizeResumeBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next();
  }

  const normalizedBody: Record<string, any> = {};

  for (const [key, value] of Object.entries(req.body)) {
    if (key === "declaration" && typeof value === "string") {
      try {
        normalizedBody.declaration = JSON.parse(value);
      } catch {
        return res.status(400).json({ error: "Invalid declaration format" });
      }
    } else {
      normalizedBody[key] = typeof value === "string" ? value : String(value);
    }
  }

  req.body = normalizedBody;

  next();
};
