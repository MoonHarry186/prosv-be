import { Response, NextFunction } from 'express';
import * as pomodoroService from './pomodoro.service';
import { CreateSessionDto, UpdateSessionDto, SessionQuery } from './pomodoro.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function createSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await pomodoroService.createSession(req.user!.userId, req.body as CreateSessionDto);
    res.status(201).json({ success: true, data: { session } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function listSessions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await pomodoroService.listSessions(req.user!.userId, req.query as unknown as SessionQuery);
    res.json({ success: true, data: result } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await pomodoroService.getSession(req.params.id, req.user!.userId);
    res.json({ success: true, data: { session } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updateSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await pomodoroService.updateSession(req.params.id, req.user!.userId, req.body as UpdateSessionDto);
    res.json({ success: true, data: { session } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function completeSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await pomodoroService.completeSession(req.params.id, req.user!.userId);
    res.json({ success: true, data: { session } } satisfies ApiResponse);
  } catch (err) { next(err); }
}
