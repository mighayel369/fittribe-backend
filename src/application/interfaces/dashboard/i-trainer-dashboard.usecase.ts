import { TrainerDashboardResponseDTO } from "application/dto/dashboard/trainer-dashboard.dto";

export const I_TRAINER_DASHBOARD_TOKEN = Symbol("I_TRAINER_DASHBOARD_TOKEN");

export interface ITrainerDashBoard{
    execute(trainerId:string):Promise<TrainerDashboardResponseDTO>
}