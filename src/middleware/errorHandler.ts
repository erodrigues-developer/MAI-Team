import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log error for debugging
  console.error('[ERROR]', new Date().toISOString(), 'Unhandled error:', err);

  // Don't expose stack traces in production
  res.status(500).json({ error: 'Internal server error' });
};