import { PaginationInputDTO } from "../common/PaginationDto"
import { PaginationOutputDTO } from "../common/PaginationDto"
export interface BookingResponseDTO{
    bookingId:string
    trainerName:string
    trainerId:string,
    bookedDate:string
    bookedTime:string
    bookedProgram:string
    sessionAmount:number
    bookingStatus:string
    trainerProfilePic:string
    meetLink?:string
    isReviewed?:boolean
}

export interface FetchAllUserBookingRequestDTO extends PaginationInputDTO{
    userId:string
}

export interface FetchAllUserBookingsResponseDTO extends PaginationOutputDTO<BookingResponseDTO>{}

export interface TrainserBookingResponseDTO{
  bookingId: string;
  clientName: string;
  clientEmail: string;
  bookedProgram: string;
  bookedDate: string;
  bookedTime: string;
  sessionAmount: number;
  bookingStatus: string;
  meetLink?:string,
  isReviewed?:boolean
}


export interface TrainerPendingBookingDTO extends  TrainserBookingResponseDTO {
  paymentMethod: string;
  paymentStatus: string;
}

export interface TrainerRescheduleRequestDTO extends  TrainserBookingResponseDTO {
  requestedNewDate: string;
  requestedNewTime: string;
  requestedBy:string
}


export interface FetchAllTrainerBookingRequestDTO extends PaginationInputDTO{
    trainerId:string
}

export interface FetchAllTrainerBookingsResponseDTO extends PaginationOutputDTO<TrainserBookingResponseDTO>{}
export interface FetchAllTrainerPendingBookingsResponseDTO extends PaginationOutputDTO<TrainerPendingBookingDTO>{}
export interface FetchAllTrainerRescheduleBookingsResponseDTO extends PaginationOutputDTO<TrainerRescheduleRequestDTO>{}


export interface AdminBookingListDTO {
  id: string;
  client: string;
  trainer: string;
  date: string;
  total: number;
  fee: number;
  status: string;
  payment: string;
}
export interface FetchAllBookingsListRequestDTO extends PaginationInputDTO{}
export interface FetchAllBookingsListResponseDTO extends PaginationOutputDTO<AdminBookingListDTO>{}

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