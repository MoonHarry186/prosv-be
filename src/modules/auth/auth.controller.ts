import { Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { RegisterDto, LoginDto, RefreshDto, GoogleLoginDto, FacebookLoginDto } from './auth.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body as RegisterDto);
    const body: ApiResponse = { success: true, data: result };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body as LoginDto);
    const body: ApiResponse = { success: true, data: result };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refresh_token } = req.body as RefreshDto;
    const tokens = await authService.refresh(refresh_token);
    const body: ApiResponse = { success: true, data: { tokens } };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  // Stateless JWT: client xoá token phía local là đủ.
  // Nếu cần blacklist token, implement ở đây.
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } } satisfies ApiResponse);
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.me(req.user!.userId);
    const body: ApiResponse = { success: true, data: { user } };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.googleLogin(req.body as GoogleLoginDto);
    res.status(200).json({ success: true, data: result } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
}

export async function facebookLogin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.facebookLogin(req.body as FacebookLoginDto);
    res.status(200).json({ success: true, data: result } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
}
