import z from 'zod'
export const PerformanceDataSchema = z.object({
    month: z.string(),
    revenue: z.number(),
    users: z.number()
});

export type PerformanceDataDTO =
    z.infer<typeof PerformanceDataSchema>;
