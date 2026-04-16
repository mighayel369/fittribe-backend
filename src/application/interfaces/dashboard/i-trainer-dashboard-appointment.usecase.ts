import { TrainerDashboardAppointmentResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";

export const I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN = Symbol("I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN");

export interface ITrainerDashBoardAppointments{
    execute(trainerId:string,date:Date):Promise<TrainerDashboardAppointmentResponseDTO>
}