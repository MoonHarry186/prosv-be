import { Response, NextFunction } from 'express';
import * as statisticsService from './statistics.service';
import { StatisticsQuery, ByCourseQuery, DailyQuery } from './statistics.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function getOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await statisticsService.getOverview(req.user!.userId, req.query as StatisticsQuery);
    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getByCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await statisticsService.getByCourse(req.user!.userId, req.query as ByCourseQuery);
    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getDaily(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await statisticsService.getDaily(req.user!.userId, req.query as DailyQuery);
    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getStreaks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await statisticsService.getStreaks(req.user!.userId);
    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) { next(err); }
}
