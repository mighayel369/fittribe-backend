
import { z } from "zod";

export const BookingSummarySchema = z.object({
  bookingId: z.string(),
  trainerName: z.string(),
  trainerId: z.string(),
  bookedDate: z.string(),
  bookedTime: z.number(),
  bookedProgram: z.string(),
  sessionAmount: z.number()
});

export type BookingSummaryDTO =
  z.infer<typeof BookingSummarySchema>;