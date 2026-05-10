import mongoose, { Schema, Document } from 'mongoose';
import { LEAVE_STATUS, LEAVE_TYPES } from 'domain/constants/leave-status';
import { LeaveEntity } from 'domain/entities/LeaveEntity';
export interface ILeave extends Document, LeaveEntity { }

const LeaveSchema = new Schema<ILeave>({
  leaveId: { type: String, required: true, unique: true },
  trainerId: {
    type: String,
    ref: "Trainer",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(LEAVE_TYPES),
    required: true
  },
  reason: { type: String, required: true, trim: true },
  start: { type: Date, required: true },
  end: {
    type: Date,
    required: true
  },
  days: { type: Number, required: true, min: 0.5 },
  status: {
    type: String,
    enum: Object.values(LEAVE_STATUS),
    default: LEAVE_STATUS.PENDING,
    index: true
  },
  documents: { type: String },
  adminComment: { type: String, trim: true }
}, {
  timestamps: true
});


LeaveSchema.index({ trainer: 1, start: 1, end: 1 });

LeaveSchema.loadClass(LeaveEntity)

export default mongoose.model<ILeave>("Leave", LeaveSchema);