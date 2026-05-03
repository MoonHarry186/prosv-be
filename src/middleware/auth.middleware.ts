import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { UnauthorizedError } from '../shared/errors';
import { AuthRequest } from '../shared/types';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('MISSING_TOKEN', 'Access token is required'));
  }

  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err: unknown) {
    const isExpired = err instanceof Error && err.name === 'TokenExpiredError';
    next(
      new UnauthorizedError(
        isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        isExpired ? 'Access token has expired' : 'Invalid access token',
      ),
    );
  }
}
