import { Notification, INotification } from '../../models/Notification';
import { Assignment } from '../../models/Assignment';
import { Course } from '../../models/Course';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { CreateNotificationDto } from './notification.types';

async function verifyOwnership(notificationId: string, userId: string): Promise<INotification> {
  const notification = await Notification.findById(notificationId);
  if (!notification) throw new NotFoundError('Notification not found');

  const assignment = await Assignment.findById(notification.assignment_id);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const course = await Course.findById(assignment.course_id);
  if (!course || String(course.user_id) !== userId) throw new ForbiddenError();

  return notification;
}

export async function createNotification(userId: string, dto: CreateNotificationDto): Promise<INotification> {
  const assignment = await Assignment.findById(dto.assignment_id);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const course = await Course.findById(assignment.course_id);
  if (!course || String(course.user_id) !== userId) throw new ForbiddenError();

  return Notification.create(dto);
}

export async function listNotifications(userId: string): Promise<INotification[]> {
  const courses = await Course.find({ user_id: userId }).select('_id');
  const courseIds = courses.map((c) => c._id);

  const assignments = await Assignment.find({ course_id: { $in: courseIds } }).select('_id');
  const assignmentIds = assignments.map((a) => a._id);

  return Notification.find({ assignment_id: { $in: assignmentIds } })
    .sort({ created_at: -1 })
    .populate('assignment_id', 'title deadline');
}

export async function toggleNotification(notificationId: string, userId: string): Promise<INotification> {
  const notification = await verifyOwnership(notificationId, userId);
  notification.is_enabled = !notification.is_enabled;
  await notification.save();
  return notification;
}

export async function deleteNotification(notificationId: string, userId: string): Promise<void> {
  await verifyOwnership(notificationId, userId);
  await Notification.findByIdAndDelete(notificationId);
}
