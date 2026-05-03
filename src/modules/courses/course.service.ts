import { Course, ICourse } from '../../models/Course';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { CreateCourseDto, UpdateCourseDto, CourseQuery } from './course.types';

async function findOwnedOrThrow(courseId: string, userId: string): Promise<ICourse> {
  const course = await Course.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  if (String(course.user_id) !== userId) throw new ForbiddenError();
  return course;
}

export async function createCourse(userId: string, dto: CreateCourseDto): Promise<ICourse> {
  return Course.create({ ...dto, user_id: userId });
}

export async function listCourses(userId: string, query: CourseQuery) {
  const filter: Record<string, unknown> = { user_id: userId };
  if (query.status) filter.status = query.status;

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, query.limit ?? 20);
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find(filter).skip(skip).limit(limit).sort({ created_at: -1 }),
    Course.countDocuments(filter),
  ]);

  return { courses, total, page, limit };
}

export async function getCourse(courseId: string, userId: string): Promise<ICourse> {
  return findOwnedOrThrow(courseId, userId);
}

export async function updateCourse(courseId: string, userId: string, dto: UpdateCourseDto): Promise<ICourse> {
  await findOwnedOrThrow(courseId, userId);
  const updated = await Course.findByIdAndUpdate(courseId, dto, { new: true });
  return updated!;
}

export async function deleteCourse(courseId: string, userId: string): Promise<void> {
  await findOwnedOrThrow(courseId, userId);
  await Course.findByIdAndDelete(courseId);
}
