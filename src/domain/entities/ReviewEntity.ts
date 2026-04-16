import { BookingEntity } from "./BookingEntity";
import { TrainerEntity } from "./TrainerEntity";
import { UserEntity } from "./UserEntity";


export class ReviewEntity {
  constructor(
    public readonly reviewId: string,
    public readonly trainerId: string | TrainerEntity,
    public readonly userId: string | UserEntity,
    public readonly bookingId: string|BookingEntity,
    public readonly rating: number,
    public readonly comment: string,
    public  isDeleted: boolean = false,
    public readonly createdAt?: Date
  ) {}
}