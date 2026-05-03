import mongoose, { Document, Schema, Types } from 'mongoose';

export type SessionStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export interface IPomodoroSession extends Document {
  user_id: Types.ObjectId;
  course_id?: Types.ObjectId;
  assignment_id?: Types.ObjectId;
  work_minutes: number;
  break_minutes: number;
  completed_cycles: number;
  status: SessionStatus;
  start_time: Date;
  end_time?: Date;
  created_at: Date;
  updated_at: Date;
}

const pomodoroSessionSchema = new Schema<IPomodoroSession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    assignment_id: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    work_minutes: { type: Number, required: true, default: 25, min: 1 },
    break_minutes: { type: Number, required: true, default: 5, min: 1 },
    completed_cycles: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'cancelled'],
      default: 'active',
    },
    start_time: { type: Date, required: true, default: Date.now },
    end_time: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

pomodoroSessionSchema.index({ user_id: 1, created_at: -1 });

export const PomodoroSession = mongoose.model<IPomodoroSession>('PomodoroSession', pomodoroSessionSchema);
