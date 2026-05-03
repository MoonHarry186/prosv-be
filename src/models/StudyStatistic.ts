import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStudyStatistic extends Document {
  user_id: Types.ObjectId;
  course_id?: Types.ObjectId;
  total_study_hours: number;
  completed_tasks: number;
  study_date: Date;
  created_at: Date;
}

const studyStatisticSchema = new Schema<IStudyStatistic>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    total_study_hours: { type: Number, default: 0, min: 0 },
    completed_tasks: { type: Number, default: 0, min: 0 },
    study_date: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  },
);

studyStatisticSchema.index({ user_id: 1, study_date: -1 });
studyStatisticSchema.index({ user_id: 1, course_id: 1, study_date: -1 });

export const StudyStatistic = mongoose.model<IStudyStatistic>('StudyStatistic', studyStatisticSchema);
