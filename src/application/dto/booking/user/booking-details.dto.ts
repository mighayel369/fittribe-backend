import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS
} from "domain/constants/payment-status";
import { UserRole } from "domain/constants/user-role";

export const UserBookingDetailsResponseSchema = z.object({
  bookingId: z.string(),
  bookedProgram: z.string(),
  bookedDate: z.string(),
  bookedTime: z.number(),
  sessionDuration: z.number(),
  bookingStatus: z.enum(BOOKING_STATUS),
  trainerId: z.string(),
  trainerName: z.string(),
  trainerProfilePic: z.string().optional(),
  trainerExperience: z.number(),
  trainerGender: z.string(),
  totalAmount: z.number(),
  payment: z.object({
    method: z.enum(PAYMENT_METHOD),
    status: z.enum(PAYMENT_STATUS),
    paymentId: z.string()
  }),

  rescheduleRequest: z.object({
    newDate: z.string(),
    newTimeSlot: z.number(),
    requestedBy: z.enum(UserRole),
    status: z.string()
  }).optional(),
  rejectReason: z.string().optional(),
  isReviewed: z.boolean().optional(),
  chatId: z.string().nullable()
});

export type UserBookingDetailsResponseDTO =
  z.infer<typeof UserBookingDetailsResponseSchema>;