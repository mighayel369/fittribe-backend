
import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PaginationRequestDTO, PaginationResponseDTO } from "application/dto/common/PaginationDto";
import { IBookingFilters } from "domain/filters/IBookingFilters";

export const TrainerRescheduleBookingSchema = z.object({
    bookingId: z.string(),
    clientName: z.string(),
    clientEmail: z.string(),
    bookedProgram: z.string(),
    bookedDate: z.string(),
    bookedTime: z.number(),
    sessionAmount: z.number(),
    bookingStatus: z.enum(BOOKING_STATUS),
    isReviewed: z.boolean().optional(),
    requestedNewDate: z.string(),
    requestedNewTime: z.number(),
    requestedBy: z.string()
});

export type TrainerRescheduleResponseDTO =
    z.infer<typeof TrainerRescheduleBookingSchema>;

export const FetchTrainerRescheduleBookingsResponseSchema =
    z.object({
        data: z.array(TrainerRescheduleBookingSchema),
        totalPages: z.number(),
        currentPage: z.number(),
        totalCount: z.number()
    });

export type FetchAllTrainerRescheduleBookingsResponseDTO =
    PaginationResponseDTO<TrainerRescheduleResponseDTO>;

export interface FetchAllTrainerBookingRequestDTO
    extends PaginationRequestDTO<IBookingFilters> {
    trainerId: string;
}
