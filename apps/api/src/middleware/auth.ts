import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Missing token header.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired access token.' });
    return;
  }

  req.user = decoded;
  next();
}
