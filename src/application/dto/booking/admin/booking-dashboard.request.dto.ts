import { z } from "zod";

export const BookingMetricsQuerySchema = z.object({
    range: z.enum(["7days", "6months"]).default("7days")
});

export type BookingMetricsQueryDTO = z.infer<typeof BookingMetricsQuerySchema>;