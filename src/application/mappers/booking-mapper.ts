import { BookingEntity } from "domain/entities/BookingEntity";
import { randomUUID } from "crypto";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import config from "config";
import { BookingAggregate } from "domain/repositories/types/booking-aggregate.type";
import { AdminDashboardMetricsAggregate } from "domain/repositories/types/admin-dashboard-aggregate";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "domain/constants/payment-status";
import { AdminBookingListItemDTO, AdminBookingListItemSchema } from "application/dto/booking/admin/admin-booking-list.dto";
import { FetchAdminBookingDashboardResponseDTO, FetchAdminBookingDashboardResponseSchema } from "application/dto/booking/admin/booking-dashboard.response.dto";
import { AdminBookingDetailsResponseDTO, AdminBookingDetailsResponseSchema } from "application/dto/booking/admin/booking-details.dto";
import { TrainerBookingItemDTO } from "application/dto/booking/trainer/fetch-trainer-bookings.dto";
import { UserBookingDetailsResponseDTO, UserBookingDetailsResponseSchema } from "application/dto/booking/user/booking-details.dto";
import { CheckoutBookingDTO } from "application/dto/booking/user/checkout-booking.schema";
import { TrainerPendingBookingDTO } from "application/dto/booking/trainer/fetch-pending-bookings.dto";
import { TrainerRescheduleResponseDTO } from "application/dto/booking/trainer/fetch-reschedule-booking.dto";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/trainer/trainer-booking-details.response.dto";
import { BookingSummaryDTO } from "application/dto/booking/shared/booking-summary.response.dto";
import { BookingResponseDTO } from "application/dto/booking/user/fetch-user-bookings.dto";




export class BookingMapper {

  static toBookingEntity(data: CheckoutBookingDTO, userId: string, paymentId: string): BookingEntity {
    const totalAmount = data.price;
    const adminPercent = config.ADMIN_PERCENT || 0.1;
    const adminCommission = totalAmount * adminPercent;
    const trainerEarning = totalAmount - adminCommission;

    return new BookingEntity(
      randomUUID(),
      userId,
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
        status: PAYMENT_STATUS.PAID,
        paymentId
      }
    );
  }

  static toAdminBookingListItemDTO(booking: BookingAggregate): AdminBookingListItemDTO {

    return AdminBookingListItemSchema.parse({
      bookingId: booking.bookingId,
      clientName: booking.user?.name ?? "Unknown User",
      trainerName: booking.trainer?.name ?? "Unknown Trainer",
      date: new Date(booking.date).toISOString(),
      totalAmount: booking.totalAmount,
      platformFee: booking.adminCommission,
      paymentMethod: booking.payment.method,
      status: booking.status
    });
  }

  static toAdminDashboardDTO(
    domainMetrics: AdminDashboardMetricsAggregate
  ): FetchAdminBookingDashboardResponseDTO {

    return FetchAdminBookingDashboardResponseSchema.parse({
      stats: {
        todaySessions: domainMetrics.stats.todaySessions,
        pendingRequests: domainMetrics.stats.pendingRequests,
        totalBookings: domainMetrics.stats.totalBookings,
        successRate: domainMetrics.stats.successRate
      },

      charts: {
        bookingTrend: domainMetrics.trends,
        statusDistribution: domainMetrics.distribution
      }
    });
  }

  static toAdminBookingDetailsResponseDTO(
    data: BookingAggregate
  ): AdminBookingDetailsResponseDTO {

    return AdminBookingDetailsResponseSchema.parse({
      bookingId: data.bookingId,
      scheduledDate: data.date.toISOString(),
      scheduledTime: data.timeSlot,
      duration: data.duration,
      sessionType: "One to one online training",
      bookingStatus: data.status,
      bookedProgram: data.program,

      payment: {
        baseRate: data.totalAmount - data.adminCommission,
        platformFee: data.adminCommission,
        totalAmount: data.totalAmount,
        paymentType: data.payment.method,
        paymentId: data.payment.paymentId,
        status: data.payment.status
      },

      client: {
        name: data.user.name,
        email: data.user.email,
        clientId: data.user.userId,
        totalSessions: data.totalSessions,
        joinedOn: data.user.createdAt?.toISOString() ?? "",
        profilePic: data.user.profilePic ?? ""
      },

      trainer: {
        name: data.trainer.name,
        trainerId: data.trainer.trainerId,
        rating: data.trainer.rating,
        experience: `${data.trainer.experience} years`,
        profilePic: data.trainer.profilePic ?? ""
      }
    });
  }

  static toTrainerBookingResponse(
    data: BookingAggregate
  ): TrainerBookingItemDTO {

    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      isReviewed: data.isReviewed
    };
  }

  static toTrainerPendingBookingResponse(
    data: BookingAggregate
  ): TrainerPendingBookingDTO {

    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      isReviewed: data.isReviewed,
      paymentMethod: data.payment.method,
      paymentStatus: data.payment.status
    };
  }


  static toTrainerRescheduleBookingResponse(
    data: BookingAggregate
  ): TrainerRescheduleResponseDTO {

    return {
      bookingId: data.bookingId,
      clientName: data.user.name,
      clientEmail: data.user.email,
      bookedProgram: data.program,
      bookedDate: new Date(data.date).toISOString(),
      bookedTime: data.timeSlot,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      isReviewed: data.isReviewed,
      requestedNewDate:
        data.rescheduleRequest?.newDate ? new Date(data.rescheduleRequest.newDate).toISOString() : "",
      requestedNewTime: data.rescheduleRequest?.newTimeSlot ?? 0,
      requestedBy: data.rescheduleRequest?.requestedBy ?? ""
    };
  }

  static toTrainerBookingDetailsResponse(
    data: BookingAggregate,
    chatId: string | null
  ): TrainerBookingDetailsResponseDTO {

    return {
      bookingId: data.bookingId,
      chatId,
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
      adminCommission: data.adminCommission,
      paymentStatus: data.payment.status,
      paymentMethod: data.payment.method,
      paymentId: data.payment.paymentId,
      rescheduleRequest:
        data.rescheduleRequest?.newDate &&
          data.rescheduleRequest?.createdAt
          ? {
            newDate: new Date(
              data.rescheduleRequest.newDate
            ).toISOString(),

            newTimeSlot:
              data.rescheduleRequest.newTimeSlot,

            requestedBy:
              data.rescheduleRequest.requestedBy,

            requestedAt: new Date(
              data.rescheduleRequest.createdAt
            ).toISOString()
          }
          : undefined,
      rejectReason: data.rejectReason,
      isReviewed: data.isReviewed
    };
  }
  static toBookingSummary(data: BookingAggregate): BookingSummaryDTO {
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

  static toUserBookingResponse(data: BookingAggregate): BookingResponseDTO {

    return {
      bookingId: data.bookingId,
      trainerName: data.trainer.name,
      trainerId: data.trainer.trainerId,
      bookedDate: data.date
        ? new Date(data.date).toISOString()
        : "N/A",
      bookedTime: data.timeSlot,
      bookedProgram: data.program,
      sessionAmount: data.totalAmount,
      bookingStatus: data.status,
      trainerProfilePic:
        data.trainer.profilePic || "",
      isReviewed: data.isReviewed
    };
  }

  static toUserBookingDetailsResponse(
    data: BookingAggregate,
    chatId: string | null
  ): UserBookingDetailsResponseDTO {

    const mappedData = {
      chatId,
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
        paymentId: data.payment.paymentId
      },
      rescheduleRequest:
        data.rescheduleRequest &&
          data.rescheduleRequest.newDate
          ? {
            newDate:
              new Date(
                data.rescheduleRequest.newDate
              ).toISOString(),
            newTimeSlot:
              data.rescheduleRequest.newTimeSlot,
            requestedBy:
              data.rescheduleRequest.requestedBy,
            status: data.status
          }
          : undefined,
      rejectReason: data.rejectReason,
      isReviewed: data.isReviewed
    };

    return UserBookingDetailsResponseSchema.parse(
      mappedData
    );
  }
}