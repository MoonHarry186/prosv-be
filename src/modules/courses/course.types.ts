export interface ScheduleSlotDto {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  start_time: string;
  end_time: string;
}

export interface CreateCourseDto {
  course_name: string;
  course_code: string;
  instructor_name?: string;
  credits: number;
  semester: string;
  academic_year: string;
  schedule?: ScheduleSlotDto[];
  color?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  status?: 'active' | 'completed' | 'archived';
}

export interface CourseQuery {
  status?: 'active' | 'completed' | 'archived';
  page?: number;
  limit?: number;
}
