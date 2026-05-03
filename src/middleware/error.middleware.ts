import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { ApiResponse } from '../shared/types';
import logger from '../shared/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ApiResponse = {
      success: false,
      error: { code: err.code, message: err.message },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  logger.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  } satisfies ApiResponse);
}
