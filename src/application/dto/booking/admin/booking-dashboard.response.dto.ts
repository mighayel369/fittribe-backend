
import { z } from "zod";

export const BookingTrendSchema = z.object({
  label: z.string(),
  bookings: z.number()
});

export const StatusDistributionSchema = z.object({
  label: z.string(),
  count: z.number()
});

export const AdminDashboardStatsSchema = z.object({
  todaySessions: z.number(),
  pendingRequests: z.number(),
  totalBookings: z.number(),
  successRate: z.string()
});

export const FetchAdminBookingDashboardResponseSchema = z.object({
  stats: AdminDashboardStatsSchema,

  charts: z.object({
    bookingTrend: z.array(BookingTrendSchema),
    statusDistribution: z.array(StatusDistributionSchema)
  })
});

export type FetchAdminBookingDashboardResponseDTO = z.infer<typeof FetchAdminBookingDashboardResponseSchema>;