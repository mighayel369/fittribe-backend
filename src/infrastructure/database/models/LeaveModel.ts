import mongoose, { Schema, Document } from 'mongoose';
import { LEAVE_TYPES,LEAVE_STATUS } from 'utils/Constants';

export interface ILeave extends Document {
  leaveId: string;
  trainer: string; 
  type: LEAVE_TYPES; 
  reason: string;
  start: Date;
  end: Date;
  days: number;
  status: LEAVE_STATUS;
  documents?: string;
  adminComment?: string;
}

const LeaveSchema = new Schema<ILeave>({
  leaveId: { type: String, required: true, unique: true },
  trainer: { 
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
    required: true,
    validate: {
      validator: function(this: ILeave, value: Date) {
        return value >= this.start;
      },
      message: "End date must be after or equal to start date."
    }
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

export default mongoose.model<ILeave>("Leave", LeaveSchema);