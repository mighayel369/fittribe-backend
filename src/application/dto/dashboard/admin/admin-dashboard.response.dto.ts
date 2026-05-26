import { z } from "zod"
import { DashboardMetricsSchema } from "./dashboard-metrics.dto";
import { PerformanceDataSchema } from "./performance-data.dto";
import { TopTrainersSchema } from "./top-trainers.dto";
import { BookingStatusSchema } from "./booking-status.dto";
import { PeakBookingTimeDataSchema } from "./peak-booking-time.dto";
export const AdminDashboardResponseSchema =
    z.object({
        metrics: DashboardMetricsSchema,
        performanceData: z.array(PerformanceDataSchema),
        topTrainers: z.array(TopTrainersSchema),
        bookingStatus: z.array(BookingStatusSchema),
        peakHoursData: z.array(PeakBookingTimeDataSchema)
    });

export type AdminDashbardResponseDTO = z.infer<typeof AdminDashboardResponseSchema>;
