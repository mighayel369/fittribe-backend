import { VerifyOnlinePaymentRequestDTO } from "../payment/verify-online-payment.dto";
export interface BookSessionWithTrainerRequestDTO {
  userId: string;
  trainerId: string;
  program: string;
  date: Date;
  time: number;
  price: number;
}

export interface BookingSummaryDTO {
  bookingId: string;
  trainerName: string;
  trainerId: string;
  bookedDate: string;
  bookedTime: number;
  bookedProgram: string;
  sessionAmount: number;
}

export interface OnlineBookingRequestDTO
  extends BookSessionWithTrainerRequestDTO,
  VerifyOnlinePaymentRequestDTO { }