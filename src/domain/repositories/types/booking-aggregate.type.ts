
import { BookingEntity } from "domain/entities/BookingEntity";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";

export interface BookingAggregate extends Omit<BookingEntity, 'userId' | 'trainerId'> {
    user: UserEntity;
    trainer: TrainerEntity;
    totalSessions:number;
};