export class ApiError extends Error {
  statusCode: number;
  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Invalid request payload or syntax.
export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

// Authentication required.
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

// Authenticated, but not authorized.
export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

// Resource not found.
export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

// Conflict with current state.
export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class ValidationError extends ApiError {
  details: string[] | Record<string, any>[];
  constructor(
    message = "Validation Error",
    details: string[] | Record<string, any>[] = []
  ) {
    super(message, 422);
    this.details = details;
    this.name = "ValidationError";
  }
}
