
import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PaginationResponseDTO } from "application/dto/common/PaginationDto";

export const TrainerBookingItemSchema = z.object({
  bookingId: z.string(),
  clientName: z.string(),
  clientEmail: z.string(),
  bookedProgram: z.string(),
  bookedDate: z.string(),
  bookedTime: z.number(),
  sessionAmount: z.number(),
  bookingStatus: z.enum(BOOKING_STATUS),
  isReviewed: z.boolean().optional()
});

export type TrainerBookingItemDTO = z.infer<typeof TrainerBookingItemSchema>;

export const FetchTrainerBookingsResponseSchema = z.object({
  data: z.array(TrainerBookingItemSchema),
  totalPages: z.number(),
  currentPage: z.number(),
  totalCount: z.number()
});

export type FetchAllTrainerBookingsResponseDTO =
  PaginationResponseDTO<TrainerBookingItemDTO>;
