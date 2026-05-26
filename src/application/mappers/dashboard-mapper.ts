import { BookingAggregate } from "domain/repositories/types/booking-aggregate.type";
import { minutesToTime } from "utils/generateTimeSlots";
import { AdminDashbardResponseDTO, AdminDashboardResponseSchema } from "application/dto/dashboard/admin/admin-dashboard.response.dto";
import { AdminDashboardStats, TrainerPerformanceAnalytics } from "domain/repositories/types/admin-dashboard-aggregate";
import { upcomingAppointmentsDTO } from "application/dto/dashboard/trainer/trainer.upcoming-appointments.dto";
import { pendingActionsDTO } from "application/dto/dashboard/trainer/trainer-pending-actions.dto";
import { TrainerMonthlyPerformanceDTO } from "application/dto/dashboard/trainer/trainer-performance-data.dto";
import { ChatListResponseDTO } from "application/dto/chat/shared/chat-list-response.dto";
import { TrainerDashboardResponseDTO, TrainerDashboardResponseSchema } from "application/dto/dashboard/trainer/trainer-dashboard.response.dto";
export class DashboardMapper {
  static toUpcomingAppointmentDTO(
    booking: BookingAggregate
  ): upcomingAppointmentsDTO {

    return {
      bookingId: booking.bookingId,
      clientName: booking.user.name,
      timeSlot: minutesToTime(
        booking.timeSlot
      ),
      program: booking.program,
      status: booking.status,
      profilePic: booking.user.profilePic || "",
    };
  }


  static toTrainerPendingActionsResponse(
    data: BookingAggregate
  ): pendingActionsDTO {

    return {
      bookingId: data.bookingId,
      type: data.status.toUpperCase(),
      clientName: data.user.name,
      detail: `Service: ${data.program}`,
      time: `${new Date(data.date).toISOString()} at ${data.timeSlot}`
    };
  }



  static toTrainerPerformanceDTO(data: { month: string; sessionCount: number; }): TrainerMonthlyPerformanceDTO {

    return {
      month: data.month,
      sessionCount: data.sessionCount
    };
  }

  static toAdminDashboardResponse(
    stats: AdminDashboardStats,
    totalActiveTrainers: number,
    trainerPerformance: TrainerPerformanceAnalytics[],
    rententionRate: string
  ): AdminDashbardResponseDTO {

    const mappedData = {

      metrics: {
        totalRevenue: stats.metrics.totalRevenue,
        totalBookings: stats.metrics.totalBookings,
        totalActiveTrainers,
        rententionRate
      },

      performanceData:
        stats.performanceData.map(
          (item) => ({
            month: item.month,
            revenue: item.revenue,
            users: item.users
          })
        ),

      topTrainers:
        trainerPerformance.map(
          (trainer) => ({
            month: trainer.month,
            name: trainer.name,
            bookings: trainer.bookings,
            rating: trainer.rating,
            revenue: trainer.revenue,
            useage: trainer.usage
          })
        ),

      bookingStatus:
        stats.bookingStatus.map(
          (item) => ({
            label: item.label,
            count: item.count
          })
        ),

      peakHoursData:
        stats.peakHoursData.map(
          (item) => ({
            time: item.time,
            count: item.count
          })
        )
    };

    return AdminDashboardResponseSchema.parse(
      mappedData
    );
  }

  static toTrainerDashboardResponse(
    payload: {
      earnings: number;
      upcomingTotal: number;
      progress: {
        completed: number;
        total: number;
      };
      averageRating: number;
      pendingActions: pendingActionsDTO[];
      performanceData: TrainerMonthlyPerformanceDTO[];
      recentChats: ChatListResponseDTO[];
    }
  ): TrainerDashboardResponseDTO {

    return TrainerDashboardResponseSchema.parse({
      metrics: {
        monthlyEarning:
          payload.earnings,
        upcomingTotal:
          payload.upcomingTotal,
        todayProgress:
          `${payload.progress.completed}/${payload.progress.total}`,
        averageRating:
          payload.averageRating
      },
      pendingActions:
        payload.pendingActions,
      performanceData:
        payload.performanceData,
      recentChats:
        payload.recentChats
    });
  }

}