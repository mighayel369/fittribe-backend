import { BookingEntity } from "domain/entities/BookingEntity";
import { ReviewEntity } from "domain/entities/ReviewEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { UserEntity } from "domain/entities/UserEntity";


export interface ReviewsList {
    reviews: Omit<ReviewEntity, "trainerId" | "userId" | "bookingId"> & {
        user: UserEntity,
        trainer: TrainerEntity,
        booking: BookingEntity
    }
}
