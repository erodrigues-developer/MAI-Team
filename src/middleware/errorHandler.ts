import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${new Date().toISOString()} ${err instanceof Error ? err.message : String(err)}`);
  res.status(500).json({ error: 'Internal server error' });
}
