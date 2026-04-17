import { z } from 'zod';

export const bookingIdSchema=z.object({
    bookingId: z.string().min(1,"Invalid booking ID format"),
});




export const bookingMetricsSchema = z.object({
  range: z.enum(['7days', '6months']).optional().default('7days'),
});