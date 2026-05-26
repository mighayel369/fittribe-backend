
import { LeaveEntity } from "domain/entities/LeaveEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";

export interface LeaveAggregate {
    leave: Omit<LeaveEntity, "trainerId">;
    trainer: Pick<
        TrainerEntity,
        | "trainerId"
        | "name"
        | "email"
        | "role"
        | "profilePic"
        | "experience"
        | "rating"
        | "status"
    >;
}