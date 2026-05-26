import { z } from "zod";

export const AcceptBookingRequestSchema = z.object({
    bookingId: z
        .string()
        .trim()
        .min(1, "Booking id is required")
});

export type AcceptBookingRequestDTO = z.infer<typeof AcceptBookingRequestSchema>;