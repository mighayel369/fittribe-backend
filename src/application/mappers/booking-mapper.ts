import { BookingEntity } from "domain/entities/BookingEntity";
import { 
    BookingResponseDTO, 
    TrainserBookingResponseDTO, 
    TrainerPendingBookingDTO, 
    TrainerRescheduleRequestDTO, 
    AdminBookingListDTO 
} from "application/dto/booking/fetch-all-bookings.dto";
import { 
    AdminBookingDetailsResponseDTO, 
    TrainerBookingDetailsResponseDTO, 
    UserBookingDetailsResponseDTO 
} from "application/dto/booking/fetch-booking-details.dto";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "utils/Constants";
import config from "config";
import { BookSessionWithTrainerRequestDTO, OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { minutesToTime, timeToMin } from "utils/generateTimeSlots";

export class BookingMapper {

  private static isUserEntity(user: any): user is UserEntity {
    return user && typeof user !== 'string' && 'name' in user;
  }

  private static isTrainerEntity(trainer: any): trainer is TrainerEntity {
    return trainer && typeof trainer !== 'string' && 'name' in trainer;
  }

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
    const trainer = entity.trainer as TrainerEntity;
    return {
      bookingId: entity.bookingId,
      bookedDate: entity.date.toISOString(),
      trainerName: trainer.name || "Trainer",
      trainerId: trainer.trainerId,
      bookedProgram: entity.program,
      bookedTime: minutesToTime(entity.timeSlot),
      bookingStatus: entity.status,
      sessionAmount: entity.totalAmount,
      trainerProfilePic: trainer.profilePic || "",
      meetLink: entity.meetLink,
      isReviewed: entity.isReviewed
    };
  }

  static toTrainerBookingsResponseDTO(entity: BookingEntity): TrainserBookingResponseDTO {
    const user = entity.user as UserEntity;
    return {
      bookingId: entity.bookingId,
      clientName: user.name || "Client",
      clientEmail: user.email || "",
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

  static toTrainerBookingDetailsDTO(entity: BookingEntity, chatId: string | null): TrainerBookingDetailsResponseDTO {
    const user = entity.user as UserEntity;
    return {
      bookingId: entity.bookingId,
      chatId: chatId,
      clientId: user.userId,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone || '',
      clientProfilePic: user.profilePic || '',

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
    const trainer = entity.trainer as TrainerEntity;
    return {
      bookingId: entity.bookingId,
      bookedProgram: entity.program,
      bookedDate: entity.date instanceof Date ? entity.date.toISOString() : entity.date,
      bookedTime: minutesToTime(entity.timeSlot),
      sessionDuration: entity.duration || 60,
      bookingStatus: entity.status,

      trainerId: trainer.trainerId,
      trainerName: trainer.name || "Professional Trainer",
      trainerProfilePic: trainer.profilePic || "",
      trainerExperience: trainer.experience || 0,
      trainerGender: trainer.gender || "Not Specified",

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
      client: this.isUserEntity(entity.user) ? entity.user.name : 'Guest',
      trainer: this.isTrainerEntity(entity.trainer) ? entity.trainer.name : 'Professional',
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
      scheduledTime: `${minutesToTime(data.timeSlot)} - ${minutesToTime(data.timeSlot + data.duration)}`,
      duration: data.duration,
      sessionType: "1-on-1 Virtual Training",
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
        profilePic: client.profilePic || ""
      },
      trainer: {
        name: trainer.name,
        trainerId: trainer.trainerId,
        serviceProvided: data.program,
        rating: trainer.rating || 0,
        experience: `${trainer.experience || 0} Years`,
        profilePic: trainer.profilePic || ""
      }
    };
  }
}