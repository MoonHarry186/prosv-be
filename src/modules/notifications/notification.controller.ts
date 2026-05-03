import { Response, NextFunction } from 'express';
import * as notificationService from './notification.service';
import { CreateNotificationDto } from './notification.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function createNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const notification = await notificationService.createNotification(req.user!.userId, req.body as CreateNotificationDto);
    res.status(201).json({ success: true, data: { notification } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function listNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifications = await notificationService.listNotifications(req.user!.userId);
    res.json({ success: true, data: { notifications } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function toggleNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const notification = await notificationService.toggleNotification(req.params.id, req.user!.userId);
    res.json({ success: true, data: { notification } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function deleteNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await notificationService.deleteNotification(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Notification deleted' } } satisfies ApiResponse);
  } catch (err) { next(err); }
}
