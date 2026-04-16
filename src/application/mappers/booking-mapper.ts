
import { BookingEntity } from "domain/entities/BookingEntity";
import { BookingResponseDTO, TrainserBookingResponseDTO, TrainerPendingBookingDTO, TrainerRescheduleRequestDTO, AdminBookingListDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { AdminBookingDetailsResponseDTO, TrainerBookingDetailsResponseDTO, UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "utils/Constants";
import config from "config";
import { BookSessionWithTrainerRequestDTO, OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto";
import { razorpayPayment } from "domain/services/types/razorpayPayment.type";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { minutesToTime, timeToMin } from "utils/generateTimeSlots";
export class BookingMapper {

  static toPaymentVerificationDTO(input: OnlineBookingRequestDTO): VerifyOnlinePaymentRequestDTO {
    return {
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature
    };
  }

  static toBookingDetailsDTO(input: OnlineBookingRequestDTO): BookSessionWithTrainerRequestDTO {
    return {
      userId: input.userId,
      trainerId: input.trainerId,
      program: input.program,
      date: input.date,
      time: input.time,
      price: input.price
    };
  }
  static toUserBookingsResponseDTO(entity: BookingEntity): BookingResponseDTO {
    return {
      bookingId: entity.bookingId,
      bookedDate: entity.date.toISOString(),
      trainerName: entity.trainer.name,
      trainerId:entity.trainer.trainerId,
      bookedProgram: entity.program,
      bookedTime: minutesToTime(entity.timeSlot),
      bookingStatus: entity.status,
      sessionAmount: entity.totalAmount,
      trainerProfilePic: entity.trainer.profilePic,
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    }
  }
  static toTrainerBookingsResponseDTO(entity: BookingEntity): TrainserBookingResponseDTO {
    return {
      bookingId: entity.bookingId,
      clientName: entity.user.name,
      clientEmail: entity.user.email,
      bookedProgram: entity.program,
      bookedDate: entity.date.toISOString(),
      bookedTime: minutesToTime(entity.timeSlot),
      bookingStatus: entity.status,
      sessionAmount: entity.totalAmount,
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    };
  }

  static toTrainerPendingResponseDTO(entity: BookingEntity): TrainerPendingBookingDTO {
    return {
      ...this.toTrainerBookingsResponseDTO(entity),
      paymentMethod: entity.payment.method,
      paymentStatus: entity.payment.status,
    };
  }

  static toTrainerRescheduleRequestsDTO(entity: BookingEntity): TrainerRescheduleRequestDTO {
    return {
      ...this.toTrainerBookingsResponseDTO(entity),
      requestedNewDate: entity.rescheduleRequest?.newDate.toISOString() || "",
      requestedNewTime: minutesToTime(entity.rescheduleRequest?.newTimeSlot || 0),
      requestedBy: entity.rescheduleRequest?.requestedBy || ""
    };
  }

  static toTrainerBookingDetailsDTO(entity: BookingEntity,chatId:string|null): TrainerBookingDetailsResponseDTO {
    return {
      bookingId: entity.bookingId,
      chatId:chatId,
      clientId:entity.user.userId,
      clientName: entity.user.name,
      clientEmail: entity.user.email,
      clientPhone: entity.user.phone || '',
      clientProfilePic: entity.user.profilePic || '',

      bookedProgram: entity.program,
      bookedDate: entity.date,
      bookedTime: minutesToTime(entity.timeSlot),
      sessionDuration: entity.duration,

      bookingStatus: entity.status,
      totalAmount: entity.totalAmount,
      trainerEarning: entity.trainerEarning,
      paymentStatus: entity.payment.status,
      paymentMethod: entity.payment.method,

      rescheduleRequest: entity.rescheduleRequest ? {
        newDate: entity.rescheduleRequest.newDate,
        newTimeSlot: minutesToTime(entity.rescheduleRequest.newTimeSlot),
        requestedBy: entity.rescheduleRequest.requestedBy,
        requestedAt: entity.rescheduleRequest.createdAt
      } : undefined,
      rejectReason: entity.rejectReason,
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    };
  }

  static toUserBookingDetailsDTO(entity: BookingEntity): UserBookingDetailsResponseDTO {
    return {
      bookingId: entity.bookingId,
      bookedProgram: entity.program,
      bookedDate: entity.date instanceof Date
        ? entity.date.toISOString()
        : entity.date,
      bookedTime: minutesToTime(entity.timeSlot),
      sessionDuration: entity.duration || 60,
      bookingStatus: entity.status,

      trainerId: entity.trainer.trainerId,
      trainerName: entity.trainer.name || "Professional Trainer",
      trainerProfilePic: entity.trainer.profilePic || "",
      trainerExperience: entity.trainer.experience || 0,
      trainerGender: entity.trainer.gender || "Not Specified",

      totalAmount: entity.totalAmount,
      payment: {
        method: entity.payment?.method || "online",
        status: entity.payment?.status || "hold",
      },
      rescheduleRequest: entity.rescheduleRequest
        ? {
          newDate: entity.rescheduleRequest.newDate.toISOString(),
          newTimeSlot: minutesToTime(entity.rescheduleRequest.newTimeSlot),
          requestedBy: entity.rescheduleRequest.requestedBy,
          status: entity.status,
        }
        : undefined,
      rejectReason: entity.rejectReason,
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    };
  }

  static toBookingEntity(data: BookSessionWithTrainerRequestDTO): BookingEntity {
    console.log('booking data', data)
    const totalAmount = data.price;
    const adminPercent = config.ADMIN_PERCENT || 0.1;
    const adminCommission = totalAmount * adminPercent;
    const trainerEarning = totalAmount - adminCommission;
    return new BookingEntity(
      randomUUID(),
      data.userId,
      data.trainerId,
      data.program,
      new Date(data.date),
      timeToMin(data.time),
      config.SESSION_DURATION,
      totalAmount,
      adminCommission,
      trainerEarning,
      BOOKING_STATUS.PENDING,
      {
        method: "online",
        status: "paid"
      }
    );
  }

static toAdminBookingsResponseDTO(entity: BookingEntity): AdminBookingListDTO {
    return {
      id: entity.bookingId,
      client: typeof entity.user === 'string' ? 'Guest' : entity.user.name,
      trainer: typeof entity.trainer === 'string' ? 'Professional' : entity.trainer.name,
      date: entity.date.toISOString().split('T')[0],
      total: entity.totalAmount,
      fee: entity.adminCommission,
      status: entity.status,
      payment: entity.payment.status
    };
  }
static toAdminBookingResponseDTO(data: BookingEntity): AdminBookingDetailsResponseDTO {
    const client = data.user as UserEntity;
    const trainer = data.trainer as TrainerEntity;

    return {
      bookingId: data.bookingId,
      scheduledDate: data.date.toLocaleDateString('en-IN', { 
        day: '2-digit', month: 'long', year: 'numeric' 
      }),
      scheduledTime:`${minutesToTime(data.timeSlot)} - ${minutesToTime(data.timeSlot+data.duration)} `,
      duration: data.duration,
      sssionType: "1-on-1 Virtual Training", 
      bookingStatus: data.status,
      payment: {
        baseRate: data.totalAmount - data.adminCommission,
        platformFee: data.adminCommission,
        totalAmount: data.totalAmount,
        paymentType: data.payment.method
      },
      client: {
        name: client.name,
        email: client.email,
        clientId: client.userId,
        totalSessions: 0, 
        joinedOn: client.createdAt ? client.createdAt.toISOString().split('T')[0] : 'N/A',
        profilePic:client.profilePic||""
      },
      trainer: {
        name: trainer.name,
        trainerId: trainer.trainerId,
        serviceProvided: data.program,
        rating: trainer.rating || 0,
        experience: `${trainer.experience || 0} Years`,
        profilePic:trainer.profilePic||""
      }
    };
  }
}