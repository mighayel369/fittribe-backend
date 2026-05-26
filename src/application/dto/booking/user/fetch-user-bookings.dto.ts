
import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import {
  PaginationResponseDTO
} from "application/dto/common/PaginationDto";


export const UserBookingSchema = z.object({
  bookingId: z.string(),
  trainerName: z.string(),
  trainerId: z.string(),
  bookedDate: z.string(),
  bookedTime: z.number(),
  bookedProgram: z.string(),
  sessionAmount: z.number(),
  bookingStatus: z.enum(BOOKING_STATUS),
  trainerProfilePic: z.string(),
  isReviewed: z.boolean().optional()
});

export type BookingResponseDTO =
  z.infer<typeof UserBookingSchema>;

export const FetchAllUserBookingsResponseSchema =
  z.object({
    data: z.array(UserBookingSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalCount: z.number()
  });

export type FetchAllUserBookingsResponseDTO =
  PaginationResponseDTO<BookingResponseDTO>;
