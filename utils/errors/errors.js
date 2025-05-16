class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.statusCode = 409;
  }
}

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.statusCode = 500;
  }
}

const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

module.exports = {
  ERROR_CODES,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
