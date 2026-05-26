import { z } from "zod";

export const DashboardMetricsSchema = z.object({
    totalRevenue: z.number(),
    totalBookings: z.number(),
    totalActiveTrainers: z.number(),
    rententionRate: z.string()
});

export type DashboardMetricsDTO = z.infer<typeof DashboardMetricsSchema>;
