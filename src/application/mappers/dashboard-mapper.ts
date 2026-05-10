import { BookingResponseType } from "domain/repositories/types/booking-type";
import { pendingActionsDTO, TrainerMonthlyPerformanceDTO, upcomingAppointmentsDTO } from "application/dto/dashboard/trainer-dashboard.dto";
import { minutesToTime } from "utils/generateTimeSlots";

export class DashboardMapper {
  static toUpcomingAppointmentDTO(booking: BookingResponseType): upcomingAppointmentsDTO {
    return {
      bookingId: booking.bookingId,
      clientName: booking.user.name,

      timeSlot: minutesToTime(booking.timeSlot),
      program: booking.program,
      status: booking.status,
      profilePic: booking.user.profilePic||"",
      meetLink: booking.meetLink
    };
  }

  static toTrainerPendingActionsResponse(data: BookingResponseType): pendingActionsDTO {
    return {
      bookingId: data.bookingId,
      type: data.status.toUpperCase(),
      clientName: data.user.name,
      detail: `Service: ${data.program}`,
      time: `${new Date(data.date).toISOString()} at ${data.timeSlot}`
    };
  }

  static toTrainerPerformanceDTO(data: { month: string; sessionCount: number }): TrainerMonthlyPerformanceDTO {
    return {
      month: data.month,
      sessionCount: data.sessionCount
    };
  }

}