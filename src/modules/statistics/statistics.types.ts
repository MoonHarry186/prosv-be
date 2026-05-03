export interface StatisticsQuery {
  start_date?: string;
  end_date?: string;
}

export interface ByCourseQuery extends StatisticsQuery {
  course_id?: string;
}

export interface DailyQuery extends StatisticsQuery {
  course_id?: string;
}
