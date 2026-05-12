import { Assignment, IAssignment } from '../../models/Assignment';
import { Course } from '../../models/Course';
import { Notification } from '../../models/Notification';
import { PomodoroSession } from '../../models/PomodoroSession';
import { NotFoundError, ForbiddenError, ValidationError } from '../../shared/errors';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentQuery } from './assignment.types';

async function checkStudyTime(assignmentId: string): Promise<void> {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new NotFoundError('Assignment not found');

  // Kiểm tra thời gian học dựa trên assignment_id HOẶC course_id của bài tập đó
  const sessions = await PomodoroSession.find({
    $or: [{ assignment_id: assignmentId }, { course_id: assignment.course_id }],
    status: 'completed',
  });

  const totalStudyTime = sessions.reduce((sum, s) => {
    if (!s.end_time || !s.start_time) return sum;
    const duration = s.end_time.getTime() - s.start_time.getTime();
    return sum + (duration > 0 ? duration : 0);
  }, 0);

  if (totalStudyTime <= 0) {
    throw new ValidationError('Bạn chưa học');
  }
}

async function verifyOwnership(assignmentId: string, userId: string): Promise<IAssignment> {
  const assignment = await Assignment.findById(assignmentId).populate('course_id');
  if (!assignment) throw new NotFoundError('Assignment not found');

  const course = await Course.findById(assignment.course_id);
  if (!course || String(course.user_id) !== userId) throw new ForbiddenError();

  return assignment;
}

export async function createAssignment(userId: string, dto: CreateAssignmentDto): Promise<IAssignment> {
  const course = await Course.findById(dto.course_id);
  if (!course) throw new NotFoundError('Course not found');
  if (String(course.user_id) !== userId) throw new ForbiddenError();

  const assignment = await Assignment.create({ ...dto, deadline: new Date(dto.deadline) });

  // Auto-schedule deadline notifications: 24h and 1h before
  await Notification.insertMany([
    { assignment_id: assignment._id, notify_before: 1440 },
    { assignment_id: assignment._id, notify_before: 60 },
  ]);

  return assignment;
}

export async function listAssignments(userId: string, query: AssignmentQuery) {
  const courses = await Course.find({ user_id: userId }).select('_id');
  const courseIds = courses.map((c) => c._id);

  const filter: Record<string, unknown> = { course_id: { $in: courseIds } };
  if (query.course_id) filter.course_id = query.course_id;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, query.limit ?? 20);
  const skip = (page - 1) * limit;

  const [assignments, total] = await Promise.all([
    Assignment.find(filter).populate('course_id').sort({ deadline: 1 }).skip(skip).limit(limit),
    Assignment.countDocuments(filter),
  ]);

  return { assignments, total, page, limit };
}

export async function getAssignment(assignmentId: string, userId: string): Promise<IAssignment> {
  return verifyOwnership(assignmentId, userId);
}

export async function updateAssignment(
  assignmentId: string,
  userId: string,
  dto: UpdateAssignmentDto,
): Promise<IAssignment> {
  const assignment = await verifyOwnership(assignmentId, userId);

  if (dto.status === 'completed' && assignment.status !== 'completed') {
    await checkStudyTime(assignmentId);
  }

  const update: Record<string, unknown> = { ...dto };
  if (dto.deadline) update.deadline = new Date(dto.deadline);

  const updated = await Assignment.findByIdAndUpdate(assignmentId, update, { new: true });
  return updated!;
}

export async function completeAssignment(assignmentId: string, userId: string): Promise<IAssignment> {
  await verifyOwnership(assignmentId, userId);
  await checkStudyTime(assignmentId);

  const updated = await Assignment.findByIdAndUpdate(
    assignmentId,
    { status: 'completed', completed_at: new Date() },
    { new: true },
  );
  // Disable pending notifications since assignment is done
  await Notification.updateMany({ assignment_id: assignmentId, sent_at: null }, { is_enabled: false });
  return updated!;
}

export async function deleteAssignment(assignmentId: string, userId: string): Promise<void> {
  await verifyOwnership(assignmentId, userId);
  await Assignment.findByIdAndDelete(assignmentId);
  await Notification.deleteMany({ assignment_id: assignmentId });
}
