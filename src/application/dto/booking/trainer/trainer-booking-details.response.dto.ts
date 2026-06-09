
import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "domain/constants/payment-status";
import { UserRole } from "domain/constants/user-role";

export const TrainerBookingDetailsResponseSchema = z.object({
  bookingId: z.string(),
  chatId: z.string().nullable(),
  clientId: z.string(),
  clientName: z.string(),
  clientEmail: z.email(),
  clientPhone: z.string().optional(),
  clientProfilePic: z.string().optional(),

  bookedProgram: z.string(),
  bookedDate: z.string(),
  bookedTime: z.number(),
  sessionDuration: z.number(),

  bookingStatus: z.enum(BOOKING_STATUS),

  totalAmount: z.number(),
  trainerEarning: z.number(),
  adminCommission: z.number(),

  paymentStatus: z.enum(PAYMENT_STATUS),
  paymentMethod: z.enum(PAYMENT_METHOD),
  paymentId: z.string(),
  rescheduleRequest: z.object({
    newDate: z.string(),
    newTimeSlot: z.number(),
    requestedBy: z.enum(UserRole),
    requestedAt: z.string()
  }).optional(),

  rejectReason: z.string().optional(),
  isReviewed: z.boolean().optional()
});

export type TrainerBookingDetailsResponseDTO =
  z.infer<typeof TrainerBookingDetailsResponseSchema>;