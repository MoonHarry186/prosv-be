export interface UpdateProfileDto {
  full_name?: string;
  student_id?: string;
  major?: string;
  notifications_enabled?: boolean;
}

export interface UpdatePasswordDto {
  current_password: string;
  new_password: string;
}

export interface UpdateFcmTokenDto {
  fcm_token: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  full_name: string;
  student_id?: string;
  major?: string;
  is_verified: boolean;
  notifications_enabled: boolean;
  fcm_token?: string;
  created_at: Date;
  updated_at: Date;
}
