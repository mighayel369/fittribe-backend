import { z } from "zod";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PaginationResponseDTO } from "application/dto/common/PaginationDto";

export const AdminBookingListItemSchema = z.object({
  bookingId: z.string(),
  clientName: z.string(),
  trainerName: z.string(),
  date: z.string(),
  totalAmount: z.number(),
  platformFee: z.number(),
  paymentMethod: z.string(),
  status: z.enum(BOOKING_STATUS)
});

export type AdminBookingListItemDTO = z.infer<typeof AdminBookingListItemSchema>;

export const FetchAllBookingsResponseSchema = z.object({
  data: z.array(AdminBookingListItemSchema),
  currentPage: z.number(),
  totalPages: z.number(),
  totalCount: z.number()
});

export type FetchAllBookingsResponseDTO = PaginationResponseDTO<AdminBookingListItemDTO>;