export interface CreateAssignmentDto {
  course_id: string;
  title: string;
  description?: string;
  deadline: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface UpdateAssignmentDto {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
  notes?: string;
  completed_at?: string;
}

export interface AssignmentQuery {
  course_id?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}
