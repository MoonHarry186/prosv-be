import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  assignment_id: Types.ObjectId;
  notify_before: number;
  is_enabled: boolean;
  sent_at?: Date;
  created_at: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    assignment_id: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    notify_before: { type: Number, required: true, min: 1 },
    is_enabled: { type: Boolean, default: true },
    sent_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  },
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
