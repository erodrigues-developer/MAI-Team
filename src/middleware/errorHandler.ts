import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const ts = new Date().toISOString();
  console.error(`[ERROR] ${ts} ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
}
