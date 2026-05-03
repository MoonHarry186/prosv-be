import { Response, NextFunction } from 'express';
import * as assignmentService from './assignment.service';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentQuery } from './assignment.types';
import { AuthRequest, ApiResponse } from '../../shared/types';

export async function createAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const assignment = await assignmentService.createAssignment(req.user!.userId, req.body as CreateAssignmentDto);
    res.status(201).json({ success: true, data: { assignment } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function listAssignments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await assignmentService.listAssignments(req.user!.userId, req.query as unknown as AssignmentQuery);
    res.json({ success: true, data: result } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function getAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const assignment = await assignmentService.getAssignment(req.params.id, req.user!.userId);
    res.json({ success: true, data: { assignment } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function updateAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const assignment = await assignmentService.updateAssignment(req.params.id, req.user!.userId, req.body as UpdateAssignmentDto);
    res.json({ success: true, data: { assignment } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function completeAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const assignment = await assignmentService.completeAssignment(req.params.id, req.user!.userId);
    res.json({ success: true, data: { assignment } } satisfies ApiResponse);
  } catch (err) { next(err); }
}

export async function deleteAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await assignmentService.deleteAssignment(req.params.id, req.user!.userId);
    res.json({ success: true, data: { message: 'Assignment deleted' } } satisfies ApiResponse);
  } catch (err) { next(err); }
}
