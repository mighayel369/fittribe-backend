import { z } from 'zod';


const bookingIdSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});


export const rejectBookingSchema = bookingIdSchema.extend({
  reason: z.string().min(5, "Please provide a reason (min 5 characters)").max(200),
});


export const trainerRescheduleSchema = bookingIdSchema.extend({
  newDate: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
    message: "Reschedule date must be in the future",
  }),
  newTimeSlot: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time"),
  }).refine((data) => data.end > data.start, {
    message: "End time must be after start time",
    path: ["end"]
  }),
});


export const bookingQuerySchema = z.object({
  pageNo: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(5),
  search: z.string().optional().default(""),
});

export { bookingIdSchema as acceptBookingSchema };