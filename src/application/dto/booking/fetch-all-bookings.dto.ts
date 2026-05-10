import { IBookingFilters } from "domain/filters/IBookingFilters"
import { PaginationInputDTO } from "../common/PaginationDto"
import { PaginationOutputDTO } from "../common/PaginationDto"
import { BOOKING_STATUS } from "domain/constants/booking-status" 

export interface BookingResponseDTO {
  bookingId: string
  trainerName: string
  trainerId: string
  bookedDate: string
  bookedTime: number
  bookedProgram: string
  sessionAmount: number
  bookingStatus: BOOKING_STATUS
  trainerProfilePic: string
  meetLink?: string
  isReviewed?: boolean
}

export interface FetchAllUserBookingRequestDTO extends PaginationInputDTO<IBookingFilters> {
  userId: string
}

export type FetchAllUserBookingsResponseDTO = PaginationOutputDTO<BookingResponseDTO>

export interface TrainserBookingResponseDTO {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  bookedProgram: string;
  bookedDate: string
  bookedTime: number;
  sessionAmount: number;
  bookingStatus: BOOKING_STATUS
  meetLink?: string,
  isReviewed?: boolean
}


export interface TrainerPendingBookingDTO extends TrainserBookingResponseDTO {
  paymentMethod: string;
  paymentStatus: string;
}

export interface TrainerRescheduleRequestDTO extends TrainserBookingResponseDTO {
  requestedNewDate: string;
  requestedNewTime: number;
  requestedBy: string
}


export interface FetchAllTrainerBookingRequestDTO extends PaginationInputDTO<IBookingFilters> {
  trainerId: string
}

export type FetchAllTrainerBookingsResponseDTO = PaginationOutputDTO<TrainserBookingResponseDTO>
export type FetchAllTrainerPendingBookingsResponseDTO = PaginationOutputDTO<TrainerPendingBookingDTO>
export type FetchAllTrainerRescheduleBookingsResponseDTO = PaginationOutputDTO<TrainerRescheduleRequestDTO>


export interface AdminBookingListDTO {
  id: string;
  client: string;
  trainer: string;
  date: string
  total: number;
  fee: number;
  status: BOOKING_STATUS;
  payment: string;
}
export type FetchAllBookingsListRequestDTO = PaginationInputDTO<IBookingFilters>
export type FetchAllBookingsListResponseDTO = PaginationOutputDTO<AdminBookingListDTO>

export interface FetchAdminBookingDashboardResponseDTO {
  stats: {
    todaySessions: number;
    pendingRequests: number;
    totalBookings: number;
    successRate: string;
  };
  charts: {
    bookingTrend: { label: string; bookings: number }[];
    statusDistribution: { label: string; count: number }[];
  };
}