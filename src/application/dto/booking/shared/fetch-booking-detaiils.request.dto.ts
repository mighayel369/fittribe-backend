import { z } from "zod";

export const BookingParamsSchema = z.object({
  bookingId: z
    .string()
    .trim()
    .min(1, "Booking id is required")
});

export type BookingParamsDTO = z.infer<typeof BookingParamsSchema>;


export const RejectBookingBodySchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters long")
    .max(300, "Reason cannot exceed 300 characters")
});

export type RejectBookingBodyDTO =
  z.infer<typeof RejectBookingBodySchema>;