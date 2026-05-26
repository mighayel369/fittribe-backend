
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';
import logger from 'logger';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  if (err instanceof AppError) {

    logger.warn(`⚠️ [${req.method} ${req.originalUrl}] - ${err.message}`);

    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }


  logger.error(`💥 Uncontrolled Crash on [${req.method} ${req.originalUrl}]:`, err);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
  return;
};