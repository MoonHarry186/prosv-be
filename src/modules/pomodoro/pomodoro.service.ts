import { PomodoroSession, IPomodoroSession } from '../../models/PomodoroSession';
import { StudyStatistic } from '../../models/StudyStatistic';
import { Assignment } from '../../models/Assignment';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { CreateSessionDto, UpdateSessionDto, SessionQuery } from './pomodoro.types';

async function findOwnedOrThrow(sessionId: string, userId: string): Promise<IPomodoroSession> {
  const session = await PomodoroSession.findById(sessionId);
  if (!session) throw new NotFoundError('Session not found');
  if (String(session.user_id) !== userId) throw new ForbiddenError();
  return session;
}

export async function createSession(userId: string, dto: CreateSessionDto): Promise<IPomodoroSession> {
  const session = await PomodoroSession.create({ ...dto, user_id: userId, start_time: new Date() });

  if (dto.assignment_id) {
    await Assignment.findOneAndUpdate(
      { _id: dto.assignment_id, status: 'pending' },
      { status: 'in_progress' },
    );
  }

  return session;
}

export async function listSessions(userId: string, query: SessionQuery) {
  const filter: Record<string, unknown> = { user_id: userId };
  if (query.course_id) filter.course_id = query.course_id;
  if (query.assignment_id) filter.assignment_id = query.assignment_id;
  if (query.status) filter.status = query.status;

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, query.limit ?? 20);
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    PomodoroSession.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
    PomodoroSession.countDocuments(filter),
  ]);

  return { sessions, total, page, limit };
}

export async function getSession(sessionId: string, userId: string): Promise<IPomodoroSession> {
  return findOwnedOrThrow(sessionId, userId);
}

export async function updateSession(
  sessionId: string,
  userId: string,
  dto: UpdateSessionDto,
): Promise<IPomodoroSession> {
  await findOwnedOrThrow(sessionId, userId);
  const updated = await PomodoroSession.findByIdAndUpdate(sessionId, dto, { new: true });
  return updated!;
}

export async function completeSession(sessionId: string, userId: string): Promise<IPomodoroSession> {
  await findOwnedOrThrow(sessionId, userId);
  const updated = await PomodoroSession.findByIdAndUpdate(
    sessionId,
    { status: 'completed', end_time: new Date() },
    { new: true },
  );

  if (updated) {
    const studyDate = new Date();
    studyDate.setHours(0, 0, 0, 0);

    const durationHours = (updated.end_time!.getTime() - updated.start_time.getTime()) / 3_600_000;

    await StudyStatistic.findOneAndUpdate(
      { user_id: userId, study_date: studyDate, course_id: updated.course_id },
      { $inc: { total_study_hours: durationHours } },
      { upsert: true, new: true },
    );
  }

  return updated!;
}
