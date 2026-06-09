import { z } from "zod";

export const PerformanceDataSchema = z.object({
    period: z.string(),
    revenue: z.number(),
    users: z.number(),
    bookings: z.number()
});

export type PerformanceDataDTO =
    z.infer<typeof PerformanceDataSchema>;
