import { TrainerLeaveMetrics } from "application/dto/leave/leave-metrics.dto";


export interface ITrainerLeaveMetrics{
    execute(trainerId:string):Promise<TrainerLeaveMetrics[]>
}