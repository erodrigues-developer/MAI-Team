import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  res.on('finish', () => {
    const ts = new Date().toISOString();
    console.log(`[INFO] ${ts} ${req.method} ${req.path} ${res.statusCode}`);
  });
  next();
}
