import z from 'zod'
export const PeakBookingTimeDataSchema = z.object({
    time: z.number(),
    count: z.number()
});

export type PeakBookingTimeDataDTO = z.infer<typeof PeakBookingTimeDataSchema>;
