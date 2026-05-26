import z from 'zod'
export const TopTrainersSchema = z.object({
    month: z.string(),
    name: z.string(),
    bookings: z.number(),
    rating: z.number(),
    revenue: z.number(),
    useage: z.string()
});

export type TopTrainersDTO = z.infer<typeof TopTrainersSchema>;