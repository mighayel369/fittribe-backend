
import { z } from "zod";

import { BOOKING_STATUS } from "domain/constants/booking-status";

import {
    PaginationResponseDTO
} from "application/dto/common/PaginationDto";


export const TrainerPendingBookingSchema = z.object({
    bookingId: z.string(),
    clientName: z.string(),
    clientEmail: z.string(),
    bookedProgram: z.string(),
    bookedDate: z.string(),
    bookedTime: z.number(),
    sessionAmount: z.number(),
    bookingStatus: z.enum(BOOKING_STATUS),
    isReviewed: z.boolean().optional(),
    paymentMethod: z.string(),
    paymentStatus: z.string()
});

export type TrainerPendingBookingDTO =
    z.infer<typeof TrainerPendingBookingSchema>;

export const FetchTrainerPendingBookingsResponseSchema =
    z.object({
        data: z.array(TrainerPendingBookingSchema),
        totalPages: z.number(),
        currentPage: z.number(),
        totalCount: z.number()
    });

export type FetchAllTrainerPendingBookingsResponseDTO =
    PaginationResponseDTO<TrainerPendingBookingDTO>;

