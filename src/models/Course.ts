import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IScheduleSlot {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  start_time: string;
  end_time: string;
}

export interface ICourse extends Document {
  user_id: Types.ObjectId;
  course_name: string;
  course_code: string;
  instructor_name?: string;
  credits: number;
  semester: string;
  academic_year: string;
  schedule: IScheduleSlot[];
  color: string;
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
}

const scheduleSlotSchema = new Schema<IScheduleSlot>(
  {
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { _id: false },
);

const courseSchema = new Schema<ICourse>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course_name: { type: String, required: true, trim: true },
    course_code: { type: String, required: true, trim: true, uppercase: true },
    instructor_name: { type: String, trim: true },
    credits: { type: Number, required: true, min: 1, max: 10 },
    semester: { type: String, required: true },
    academic_year: { type: String, required: true },
    schedule: { type: [scheduleSlotSchema], default: [] },
    color: { type: String, default: '#4A90E2', match: /^#[0-9A-Fa-f]{6}$/ },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

courseSchema.index({ user_id: 1, status: 1 });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
