import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return
  }

  res.status(500).json({
    success: false,
    message: ERROR_MESSAGES.SOMETHING_WENT_WRONG
  });
  return
};