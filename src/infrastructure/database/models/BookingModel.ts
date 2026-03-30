import mongoose, { Schema, Document } from "mongoose";
import { BOOKING_STATUS, UserRole } from "utils/Constants";
export interface IBooking extends Document {
  bookingId:string
  user: string;
  trainer: string;
  program: string;

  date: Date;
  timeSlot: number;
  duration: number;

  totalAmount: number;
  adminCommission: number;
  trainerEarning: number;

  status: BOOKING_STATUS

  payment: {
    method: "wallet" | "online";
    status: "hold" | "paid" | "refunded";
  };

  rescheduleRequest?: {
    newDate: Date;
    newTimeSlot: number;
    requestedBy: UserRole
    reason?: string;
  };
  rescheduleCount?:number
  sessionRating?:number,
  rejectReason?:string
}

const BookingSchema = new Schema<IBooking>({
   bookingId: { type: String, required: true, trim: true,unique: true },
  user: { type: String, ref: "User", required: true },
  trainer: { type: String, ref: "Trainer", required: true },
  program: { type: String, required: true },

  date: Date,
  timeSlot: Number,
  duration: Number,

  totalAmount: Number,
  adminCommission: Number,
  trainerEarning: Number,

  status: {
  type: String,
  enum: Object.values(BOOKING_STATUS),
  default: BOOKING_STATUS.PENDING      
},


  payment: {
    method: String,
    status: String
  },
  rescheduleRequest: {
    newDate: Date,
    newTimeSlot: Number,
    requestedBy:{type:String,enum:Object.values(UserRole)}
  },
  rescheduleCount:Number,
  sessionRating:Number,
  rejectReason:String
}, { timestamps: true});

export default mongoose.model<IBooking>("Booking", BookingSchema);
