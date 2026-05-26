import { z } from "zod";

export const RescheduleRequestSchema = z.object({
  bookingId: z
    .string()
    .trim()
    .min(1, "Booking id is required"),

  newDate: z.coerce.date({
    message: "Invalid reschedule date"
  }),

  newTimeSlot: z
    .number({
      message: "Time slot is required"
    })
    .min(0, "Invalid time slot"),

  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters")
    .max(300, "Reason cannot exceed 300 characters")
});

export type RescheduleRequestDTO =
  z.infer<typeof RescheduleRequestSchema>;