export interface CreateSessionDto {
  course_id?: string;
  assignment_id?: string;
  work_minutes?: number;
  break_minutes?: number;
}

export interface UpdateSessionDto {
  status?: 'active' | 'paused' | 'cancelled';
  completed_cycles?: number;
}

export interface SessionQuery {
  course_id?: string;
  assignment_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}
