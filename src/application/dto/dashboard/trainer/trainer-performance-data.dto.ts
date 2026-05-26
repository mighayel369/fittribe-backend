import z from 'zod'
export const TrainerMonthlyPerformanceSchema = z.object({
    month: z.string(),
    sessionCount: z.number()
});

export type TrainerMonthlyPerformanceDTO =
    z.infer<typeof TrainerMonthlyPerformanceSchema>;