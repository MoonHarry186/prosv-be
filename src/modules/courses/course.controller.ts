import { Response, NextFunction } from 'express';
import * as courseService from './course.service';
import { CreateCourseDto, UpdateCourseDto, CourseQuery } from './course.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function createCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const course = await courseService.createCourse(req.user!.userId, req.body as CreateCourseDto);
    res.status(201).json({ success: true, data: { course } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function listCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await courseService.listCourses(req.user!.userId, req.query as unknown as CourseQuery);
    res.json({ success: true, data: result } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const course = await courseService.getCourse(req.params.id, req.user!.userId);
    res.json({ success: true, data: { course } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updateCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const course = await courseService.updateCourse(req.params.id, req.user!.userId, req.body as UpdateCourseDto);
    res.json({ success: true, data: { course } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function deleteCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await courseService.deleteCourse(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Course deleted' } } satisfies ApiResponse);
  } catch (err) { next(err); }
}
