import { PomodoroSession } from '../../models/PomodoroSession';
import { Assignment } from '../../models/Assignment';
import { Course } from '../../models/Course';
import { StudyStatistic } from '../../models/StudyStatistic';
import { StatisticsQuery, ByCourseQuery, DailyQuery } from './statistics.types';

function dateRange(query: StatisticsQuery) {
  const filter: Record<string, unknown> = {};
  if (query.start_date || query.end_date) {
    filter.created_at = {};
    if (query.start_date) (filter.created_at as Record<string, unknown>).$gte = new Date(query.start_date);
    if (query.end_date) (filter.created_at as Record<string, unknown>).$lte = new Date(query.end_date);
  }
  return filter;
}

export async function getOverview(userId: string, query: StatisticsQuery) {
  const sessionFilter = { user_id: userId, ...dateRange(query) };
  const assignmentFilter = { status: 'completed' };

  const courses = await Course.find({ user_id: userId }).select('_id credits');
  const courseIds = courses.map((c) => c._id);
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);

  const [sessions, completedAssignments, totalAssignments] = await Promise.all([
    PomodoroSession.find(sessionFilter),
    Assignment.countDocuments({ course_id: { $in: courseIds }, ...assignmentFilter }),
    Assignment.countDocuments({ course_id: { $in: courseIds } }),
  ]);

  const total_study_hours = sessions.reduce((sum, s) => {
    if (!s.end_time) return sum;
    return sum + (s.end_time.getTime() - s.start_time.getTime()) / 3_600_000;
  }, 0);

  return {
    total_study_hours: Math.round(total_study_hours * 100) / 100,
    total_sessions: sessions.length,
    completed_assignments: completedAssignments,
    total_assignments: totalAssignments,
    total_credits: totalCredits,
  };
}

export async function getByCourse(userId: string, query: ByCourseQuery) {
  const courseFilter: Record<string, unknown> = { user_id: userId };
  if (query.course_id) courseFilter._id = query.course_id;

  const courses = await Course.find(courseFilter).select('_id course_name color');

  const result = await Promise.all(
    courses.map(async (course) => {
      const sessionFilter = {
        user_id: userId,
        course_id: course._id,
        ...dateRange(query),
      };
      const sessions = await PomodoroSession.find(sessionFilter);
      const total_study_hours = sessions.reduce((sum, s) => {
        if (!s.end_time) return sum;
        return sum + (s.end_time.getTime() - s.start_time.getTime()) / 3_600_000;
      }, 0);
      const completed_tasks = await Assignment.countDocuments({
        course_id: course._id,
        status: 'completed',
      });
      return {
        course_id: course._id,
        course_name: course.course_name,
        color: course.color,
        total_study_hours: Math.round(total_study_hours * 100) / 100,
        total_sessions: sessions.length,
        completed_tasks,
      };
    }),
  );

  return result;
}

export async function getDaily(userId: string, query: DailyQuery) {
  const filter: Record<string, unknown> = { user_id: userId, ...dateRange(query) };
  if (query.course_id) filter.course_id = query.course_id;

  return StudyStatistic.find(filter).sort({ study_date: -1 }).limit(90);
}

export async function getStreaks(userId: string) {
  const stats = await StudyStatistic.find({ user_id: userId })
    .select('study_date')
    .sort({ study_date: -1 });

  if (stats.length === 0) return { current_streak: 0, longest_streak: 0 };

  const dates = [...new Set(stats.map((s) => s.study_date.toISOString().slice(0, 10)))];

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

  const today = new Date().toISOString().slice(0, 10);
  if (dates[0] !== today && dates[0] !== new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)) {
    return { current_streak: 0, longest_streak: 1 };
  }

  for (let i = 0; i < dates.length - 1; i++) {
    const diff =
      (new Date(dates[i]).getTime() - new Date(dates[i + 1]).getTime()) / 86_400_000;
    if (diff === 1) {
      streak++;
    } else {
      if (i === 0) currentStreak = streak;
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);
  if (currentStreak === 0) currentStreak = streak;

  return { current_streak: currentStreak, longest_streak: longestStreak };
}
