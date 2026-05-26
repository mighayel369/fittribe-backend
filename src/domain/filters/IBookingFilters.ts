
import { BOOKING_TYPES } from "utils/Constants";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { z } from "zod";

export const BookingDateRangeSchema = z.object({ start: z.coerce.date(), end: z.coerce.date() });

export const BookingFiltersSchema =
    z.object({
        date: z.string().trim().optional(),
        status: z.enum(BOOKING_STATUS).optional(),
        trainerId: z.string().trim().optional(),
        clientId: z.string().trim().optional(),
        filterType: z.enum(BOOKING_TYPES).optional(),
        dateRange: BookingDateRangeSchema.optional(),
        minAmount: z.coerce.number().positive().optional(),
        search: z.string().trim().optional()
    });

export type IBookingFilters = z.infer<typeof BookingFiltersSchema>;