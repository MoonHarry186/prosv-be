import { Response, NextFunction } from 'express';
import * as userService from './user.service';
import { UpdateProfileDto, UpdatePasswordDto, UpdateFcmTokenDto } from './user.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getProfile(req.user!.userId);
    res.json({ success: true, data: { user } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body as UpdateProfileDto);
    res.json({ success: true, data: { user } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.updatePassword(req.user!.userId, req.body as UpdatePasswordDto);
    res.json({ success: true, data: { message: 'Password updated' } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updateFcmToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.updateFcmToken(req.user!.userId, req.body as UpdateFcmTokenDto);
    res.json({ success: true, data: { message: 'FCM token updated' } } satisfies ApiResponse);
  } catch (err) { next(err); }
}
