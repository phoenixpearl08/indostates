import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, err.message || err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An internal server error occurred. Please contact hospital technical support.';

  // Never leak internal stack traces to users or clients
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { errorType: err.name } : {}),
  });
};
