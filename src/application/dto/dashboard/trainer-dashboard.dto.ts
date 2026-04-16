import { ChatListResponseDTO } from "../chat/chat-list.dto"
export interface pendingActionsDTO{
    bookingId:string,
    type:string,
    clientName:string,
    detail:string,
    time:string
}
export interface upcomingAppointmentsDTO{
    bookingId:string,
    clientName:string,
    timeSlot:string,
    program:string,
    status:string,
    profilePic:string,
    meetLink?:string
}
export interface TrainerMonthlyPerformanceDTO{
    month:string,
    sessionCount:number
}
  export interface TrainerDashboardResponseDTO{
    metrics:{
        monthlyEarning:number,
        upcomingTotal:number,
        todayProgress:string,
        averageRating:number
    },
    pendingActions:pendingActionsDTO[],
    performanceData:TrainerMonthlyPerformanceDTO[],
    recentChats:ChatListResponseDTO[]
  }
    export interface TrainerDashboardAppointmentResponseDTO{
        upcomingAppointments:upcomingAppointmentsDTO[]
  }
