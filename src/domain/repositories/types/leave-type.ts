import { LeaveEntity } from "domain/entities/LeaveEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";


export interface LeaveRequestsType {
    leave: Omit<LeaveEntity, "trainerId">
    trainer: TrainerEntity
}