import jwt from 'jsonwebtoken';
import { AuthPayload } from '../shared/types';

function getSecret(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not defined`);
  return value;
}

export function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret('JWT_SECRET'), {
    expiresIn: (process.env.JWT_EXPIRY ?? '15m') as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret('REFRESH_TOKEN_SECRET'), {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, getSecret('JWT_SECRET')) as AuthPayload;
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, getSecret('REFRESH_TOKEN_SECRET')) as AuthPayload;
}
