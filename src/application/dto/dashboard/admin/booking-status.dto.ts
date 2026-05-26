import z from 'zod'
export const BookingStatusSchema = z.object({
    label: z.string(),
    count: z.number()
});

export type BookingStatusDTO = z.infer<typeof BookingStatusSchema>;