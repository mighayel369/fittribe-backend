
import { BookingEntity } from "domain/entities/BookingEntity";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";

export type BookingResponseType = Omit<BookingEntity, 'userId' | 'trainerId'> & {
    user: UserEntity;
    trainer: TrainerEntity;
};