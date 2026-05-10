import { BookingEntity } from "domain/entities/BookingEntity";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import config from "config";
import { BookingSummaryDTO, BookSessionWithTrainerRequestDTO, OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto";
import { BookingResponseType } from "domain/repositories/types/booking-type";
import { AdminBookingListDTO, BookingResponseDTO, TrainerPendingBookingDTO, TrainerRescheduleRequestDTO, TrainserBookingResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { AdminDashboardMetrics } from "domain/repositories/types/admin-dashboard-type";
import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { AdminBookingDetailsResponseDTO, TrainerBookingDetailsResponseDTO, UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "domain/constants/payment-status";



export class BookingMapper {
  static toPaymentVerificationDTO(input: OnlineBookingRequestDTO): VerifyOnlinePaymentRequestDTO {
    return {
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature
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
      data.time,
      config.SESSION_DURATION,
      totalAmount,
      adminCommission,
      trainerEarning,
      BOOKING_STATUS.PENDING,
      {
        method: PAYMENT_METHOD.ONLINE,
        status: PAYMENT_STATUS.PAID
      }
    );
  }
  static toAdminBookingListResponse(data: BookingResponseType): AdminBookingListDTO {
    return {
      id: data.bookingId,
      client: data.user.name,
      trainer: data.trainer.name,
      date: new Date(data.date).toISOString(),
      total: data.totalAmount,
      fee: data.adminCommission,
      status: data.status,
      payment: data.payment.method
    };
  }

  static toAdminDashboardDTO(domainMetrics: AdminDashboardMetrics): FetchAdminBookingDashboardResponseDTO {
    return {
      stats: {
        todaySessions: domainMetrics.stats.todaySessions,
        pendingRequests: domainMetrics.stats.pendingRequests,
        totalBookings: domainMetrics.stats.totalBookings,
        successRate: domainMetrics.stats.successRate,
      },
      charts: {
        bookingTrend: domainMetrics.trends,
        statusDistribution: domainMetrics.distribution
      }
    };
  }

  static toAdminBookingDetailsResponse(data: BookingResponseType): AdminBookingDetailsResponseDTO {
    return {
      bookingId: data.bookingId,
      scheduledDate: data.date ? new Date(data.date).toISOString() : "N/A",
      scheduledTime: data.timeSlot,
      duration: data.duration,
      sessionType: "One to one online training",
      bookingStatus: data.status,
      payment: {
        baseRate: data.totalAmount - data.adminCommission,
        platformFee: data.adminCommission,
        totalAmount: data.totalAmount,
        paymentType: data.payment.method
      },
      client: {
        name: data.user.name,
        email: data.user.email,
        clientId: data.user.userId,
        totalSessions: 0,
        joinedOn: data.user.createdAt ? new Date(data.user.createdAt).toISOString() : "N/A",
        profilePic: data.user.profilePic || ""
      },
      trainer: {
        name: data.trainer.name,
        trainerId: data.trainer.trainerId,
        serviceProvided: "Fitness Instruction",
        rating: data.trainer.rating || 0,
        experience: `${data.trainer.experience} years`,
        profilePic: data.trainer.profilePic || ""
      }
    };
  }

  static toTrainerBookingResponse(data: BookingResponseType): TrainserBookingResponseDTO {
    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: data.date ? new Date(data.date).toISOString() : "N/A",
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      meetLink: data.meetLink,
      isReviewed: data.isReviewed
    };
  }

  static toTrainerPendingBookingResponse(data: BookingResponseType): TrainerPendingBookingDTO {
    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      meetLink: data.meetLink,
      isReviewed: data.isReviewed,
      paymentMethod: data.payment.method,
      paymentStatus: data.payment.status
    };
  }

  static toTrainerRescheduleBookingResponse(data: BookingResponseType): TrainerRescheduleRequestDTO {
    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: data.date ? new Date(data.date).toISOString() : "N/A",
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      meetLink: data.meetLink || "",
      isReviewed: data.isReviewed,

      requestedNewDate: data.rescheduleRequest?.newDate
        ? new Date(data.rescheduleRequest.newDate).toISOString()
        : "N/A",

      requestedNewTime: data.rescheduleRequest?.newTimeSlot ?? 0,

      requestedBy: data.rescheduleRequest?.requestedBy ?? "unknown"
    };
  }

  static toTrainerBookingDetailsResponse(
    data: BookingResponseType,
    chatId: string | null
  ): TrainerBookingDetailsResponseDTO {
    return {
      bookingId: data.bookingId,
      chatId: chatId,
      clientId: data.user.userId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      clientPhone: data.user.phone || "Not provided",
      clientProfilePic: data.user.profilePic || "",

      bookedProgram: data.program,

      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionDuration: data.duration,

      bookingStatus: data.status,
      totalAmount: data.totalAmount,
      trainerEarning: data.trainerEarning,
      paymentStatus: data.payment.status,
      paymentMethod: data.payment.method,


      rescheduleRequest: data.rescheduleRequest && data.rescheduleRequest.newDate ? {
        newDate: new Date(data.rescheduleRequest.newDate).toISOString(),
        newTimeSlot: data.rescheduleRequest.newTimeSlot,
        requestedBy: data.rescheduleRequest.requestedBy,
        requestedAt:new Date(data.rescheduleRequest.createdAt).toISOString()
          
      } : undefined,

      rejectReason: data.rejectReason,
      meetLink: data.meetLink || "",
      isReviewed: data.isReviewed
    };
  }

  static toBookingSummary(data: BookingResponseType): BookingSummaryDTO {
    return {
      bookingId: data.bookingId,
      trainerName: data.trainer.name,
      trainerId: data.trainer.trainerId,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      bookedProgram: data.program,
      sessionAmount: data.totalAmount
    };
  }

  static toUserBookingResponse(data: BookingResponseType): BookingResponseDTO {
    return {
      bookingId: data.bookingId,
      trainerName: data.trainer.name,
      trainerId: data.trainer.trainerId,
      bookedDate: data.date ? new Date(data.date).toISOString() : "N/A",
      bookedTime: data.timeSlot,
      bookedProgram: data.program,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      trainerProfilePic: data.trainer.profilePic || "",
      meetLink: data.meetLink,
      isReviewed: data.isReviewed
    };
  }

  static toUserBookingDetailsResponse(data: BookingResponseType): UserBookingDetailsResponseDTO {
    return {
      bookingId: data.bookingId,
      bookedProgram: data.program,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionDuration: data.duration,
      bookingStatus: data.status,

      trainerId: data.trainer.trainerId,
      trainerName: data.trainer.name,
      trainerProfilePic: data.trainer.profilePic || "",
      trainerExperience: data.trainer.experience,
      trainerGender: data.trainer.gender,

      totalAmount: data.totalAmount,
      payment: {
        method: data.payment.method,
        status: data.payment.status,
      },

      rescheduleRequest: data.rescheduleRequest && data.rescheduleRequest.newDate ? {
        newDate: new Date(data.rescheduleRequest.newDate).toISOString(),
        newTimeSlot: data.rescheduleRequest.newTimeSlot,
        requestedBy: data.rescheduleRequest.requestedBy,
        status: data.status
      } : undefined,

      rejectReason: data.rejectReason,
      meetLink: data.meetLink,
      isReviewed: data.isReviewed
    };
  }
}