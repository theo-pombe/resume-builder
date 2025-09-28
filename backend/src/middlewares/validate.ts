import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { ValidationError } from "../utils/apiError.js";

interface ValidateSchemas<TBody = any, TParams = any, TQuery = any> {
  body?: ObjectSchema<TBody>;
  params?: ObjectSchema<TParams>;
  query?: ObjectSchema<TQuery>;
}

export const validate =
  <TBody = any, TParams = any, TQuery = any>({
    body,
    params,
    query,
  }: ValidateSchemas<TBody, TParams, TQuery>) =>
  (
    req: Request<any, any, TBody, TQuery> & {
      body: TBody;
      params: TParams;
      query: TQuery;
    },
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (body) {
        const { error, value } = body.validate(req.body, { abortEarly: false });
        if (error)
          throw new ValidationError("Invalid request body", error.details);
        req.body = value;
      }

      if (params) {
        const { error, value } = params.validate(req.params, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError("Invalid request params", error.details);
        req.params = value;
      }

      if (query) {
        const { error, value } = query.validate(req.query, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError("Invalid request query", error.details);
        req.query = value;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default validate;
