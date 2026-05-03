import mongoose, { Document, Schema, Types } from 'mongoose';

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type AssignmentPriority = 'low' | 'medium' | 'high';

export interface IAssignment extends Document {
  course_id: Types.ObjectId;
  title: string;
  description?: string;
  deadline: Date;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  notes?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    notes: { type: String, trim: true },
    completed_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

assignmentSchema.index({ course_id: 1, status: 1 });
assignmentSchema.index({ deadline: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
