import { BookingEntity } from "domain/entities/BookingEntity";
import { 
  pendingActionsDTO, 
  upcomingAppointmentsDTO, 
  TrainerDashboardResponseDTO, 
  TrainerMonthlyPerformanceDTO,
  TrainerDashboardAppointmentResponseDTO
} from "application/dto/dashboard/trainer-dashboard.dto";
import { AdminDashbardResponseDTO } from "application/dto/dashboard/admin-dashboard.dto";
import { minutesToTime } from "utils/generateTimeSlots";
import { ChatEntity } from "domain/entities/ChatEntity";
import { ChatMapper } from "./chat-mapper";
import { UserEntity } from "domain/entities/UserEntity";

export class DashboardMapper {

  private static getUser(booking: BookingEntity): UserEntity {
    return booking.user as UserEntity;
  }

  static toPendingActionDTO(booking: BookingEntity): pendingActionsDTO {
    const user = this.getUser(booking);
    
    const detailText = booking.rescheduleRequest 
      ? `Requested: ${minutesToTime(booking.rescheduleRequest.newTimeSlot)}` 
      : `${booking.program} session`;

    return {
      bookingId: booking.bookingId,
      type: booking.status,
      clientName: user.name || "Client",
      detail: detailText,
      time: "Recently" 
    };
  }

  static toTrainerMonthlyPerformanceDTO(data: { month: string, sessionCount: number }): TrainerMonthlyPerformanceDTO {
    return {
      month: data.month,
      sessionCount: data.sessionCount || 0
    };
  }

  static toUpcomingAppointmentDTO(booking: BookingEntity): upcomingAppointmentsDTO {
    const user = this.getUser(booking);
    
    return {
      bookingId: booking.bookingId,
      clientName: user.name || "Client",
      timeSlot: minutesToTime(booking.timeSlot),
      program: booking.program,
      status: booking.status,
      profilePic: user.profilePic || "",
      meetLink: booking.meetLink || ""
    };
  }

  static toTrainerDashboardResponseDTO(
    earnings: number,
    pending: BookingEntity[],
    progress: { completed: number; total: number },
    performance: { month: string; sessionCount: number }[],
    upcomingTotal: number,
    rating: number,
    chatList: ChatEntity[],
    trainerId: string
  ): TrainerDashboardResponseDTO {
    return {
      metrics: {
        monthlyEarning: earnings,
        upcomingTotal: upcomingTotal,
        todayProgress: `${progress.completed}/${progress.total}`,
        averageRating: rating
      },
      pendingActions: pending.map(p => this.toPendingActionDTO(p)), 
      performanceData: performance.map(p => this.toTrainerMonthlyPerformanceDTO(p)),
      recentChats: chatList.map(chat => ChatMapper.toTrainerChatListResponseDTO(chat, trainerId))
    };
  }

  static toTrainerAppointmentResponseDTO(appointments: BookingEntity[]): TrainerDashboardAppointmentResponseDTO {
    return {
        upcomingAppointments: appointments.map(p => this.toUpcomingAppointmentDTO(p))
    };
  }

  static toAdminDashboardResponseDTO(
    analytics: any,
    totalActiveTrainers: number,
    trainerPerformance: any[],
    retentionData: string
  ): AdminDashbardResponseDTO {
    return {
      metrics: {
        totalRevenue: analytics?.metrics?.totalRevenue || 0,
        totalBookings: analytics?.metrics?.totalBookings || 0,
        totalActiveTrainers: totalActiveTrainers,
        rententionRate: retentionData && retentionData.toString().endsWith('%') 
          ? retentionData 
          : `${retentionData || 0}%`
      },
      performanceData: analytics?.performanceData || [],
      bookingStatus: analytics?.bookingStatus || [],
      peakHoursData: (analytics?.peakHoursData || []).map((curr: any) => ({
        time: minutesToTime(curr.time), 
        count: curr.count
      })),
      topTrainers: (trainerPerformance || []).map(t => ({
        month: t.month || "Current",
        name: t.name || "N/A",
        bookings: t.bookings || 0,
        rating: t.rating || 0,
        revenue: t.revenue || 0,
        useage: t.usage || "0%" 
      }))
    };
  }
}