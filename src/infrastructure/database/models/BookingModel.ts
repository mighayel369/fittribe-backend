import mongoose, { Schema, Document } from "mongoose";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { UserRole } from "domain/constants/user-role";
import { BookingEntity } from "domain/entities/BookingEntity";

export interface IBooking extends Document, BookingEntity { }

const BookingSchema = new Schema<IBooking>({
  bookingId: { type: String, required: true, trim: true, unique: true },
  userId: { type: String, ref: "User", required: true },
  trainerId: { type: String, ref: "Trainer", required: true },
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
    requestedBy: { type: String, enum: Object.values(UserRole) },
    createdAt: { type: Date, default: Date.now },
    reason: String
  },
  rescheduleCount: Number,
  rejectReason: String,
  meetLink: { type: String },
  isReviewed: { type: Boolean, default: false },
}, { timestamps: true });

BookingSchema.loadClass(BookingEntity)

export default mongoose.model<IBooking>("Booking", BookingSchema);
