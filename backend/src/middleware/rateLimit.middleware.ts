import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

export const rateLimit = (maxRequests = 100, windowMs = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();

    const record = ipRequestMap.get(ip);

    if (!record || now > record.resetTime) {
      ipRequestMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    record.count++;

    if (record.count > maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a few moments before trying again.',
      });
      return;
    }

    next();
  };
};
