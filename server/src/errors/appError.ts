export class AppError extends Error {
  status = 500

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class BadRequestError extends AppError {
  readonly status = 400
}

export class NotFoundError extends AppError {
  readonly status = 404
}

export class ConflictError extends AppError {
  readonly status = 409
}

export class UnauthorizedError extends AppError {
  readonly status = 401
}
