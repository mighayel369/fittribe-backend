import { HttpStatus } from "utils/HttpStatus";

export class AppError extends Error {
  constructor(public message: string, public statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}