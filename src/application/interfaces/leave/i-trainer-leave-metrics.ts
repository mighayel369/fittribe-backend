import { TrainerLeaveMetrics } from "application/dto/leave/trainer/trainer-leave-metrics.dto";
export const I_GET_TRAINER_LEAVE_METRICS_TOKEN = Symbol("I_GET_TRAINER_LEAVE_METRICS_TOKEN");

export interface ITrainerLeaveMetrics {
    execute(trainerId: string): Promise<TrainerLeaveMetrics[]>
}