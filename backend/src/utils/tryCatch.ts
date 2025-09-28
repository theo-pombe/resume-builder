import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const tryCatch =
  (
    controllerFunc: AsyncController,
    controllerName = "UnnamedController"
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await controllerFunc(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message = `[${controllerName}] ${error.message}`;
      }
      next(error);
    }
  };

export default tryCatch;
