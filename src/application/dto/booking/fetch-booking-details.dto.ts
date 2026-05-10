import { UserRole } from "domain/constants/user-role";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "domain/constants/payment-status";

export interface TrainerBookingDetailsResponseDTO {
  bookingId: string;
  chatId: string | null
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientProfilePic?: string;

  bookedProgram: string;
  bookedDate: string
  bookedTime: number;
  sessionDuration: number;

  bookingStatus: BOOKING_STATUS;
  totalAmount: number;
  trainerEarning: number;
  paymentStatus: string;
  paymentMethod: string;

  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: number;
    requestedBy: UserRole
    requestedAt: string;
  };
  rejectReason?: string
  meetLink?: string,
  isReviewed?: boolean,
}


export interface UserBookingDetailsResponseDTO {
  bookingId: string;

  bookedProgram: string;
  bookedDate: string
  bookedTime: number;
  sessionDuration: number;
  bookingStatus: BOOKING_STATUS

  trainerId: string;
  trainerName: string;
  trainerProfilePic?: string;
  trainerExperience: number;
  trainerGender: string;

  totalAmount: number;
  payment: {
    method: PAYMENT_METHOD;
    status: PAYMENT_STATUS;
  };


  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: number
    requestedBy: UserRole,
    status: string;
  };
  rejectReason?: string
  meetLink?: string,
  isReviewed?: boolean
}

export interface AdminBookingDetailsResponseDTO {
  bookingId: string
  scheduledDate: string
  scheduledTime: number
  duration: number
  sessionType: string
  bookingStatus: BOOKING_STATUS
  payment: {
    baseRate: number
    platformFee: number
    totalAmount: number
    paymentType: PAYMENT_METHOD
  }
  client: {
    name: string
    email: string
    clientId: string
    totalSessions: number
    joinedOn: string
    profilePic: string
  }
  trainer: {
    name: string,
    trainerId: string
    serviceProvided: string
    rating: number
    experience: string
    profilePic: string
  }
}