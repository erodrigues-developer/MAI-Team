import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log incoming request
  console.log('[INFO]', new Date().toISOString(), `${req.method} ${req.path}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('[INFO]', new Date().toISOString(), `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
};