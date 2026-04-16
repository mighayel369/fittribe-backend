import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { IAddReview } from "application/interfaces/review/i-add-review";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { inject, injectable } from "tsyringe";
import { ReviewMapper } from "application/mappers/review-mapper";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { CalculateAverageRating } from "utils/CalculateAvgRating";

@injectable()
export class AddReviewUseCase implements IAddReview {
    constructor(
        @inject(I_REVIEW_REPO_TOKEN) private _reviewRepo: IReviewRepo,
        @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
        @inject(I_TRAINER_REPO_TOKEN) private _trainerRepo: ITrainerRepo
    ) { }

    async execute(data: AddReviewDTO): Promise<void> {
        const review = ReviewMapper.toEntity(data);
        await this._reviewRepo.addReview(review);

        const bookingEntity = await this._bookingRepo.findBookingById(data.bookingId);
        if (!bookingEntity) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        
        bookingEntity.isReviewed = true;
        await this._bookingRepo.updateBooking(data.bookingId, bookingEntity);

        const trainerEntity = await this._trainerRepo.findTrainerById(data.trainerId);
        if (!trainerEntity) {
            throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const newAverage = CalculateAverageRating(
            trainerEntity.rating || 0, 
            trainerEntity.reviewCount || 0, 
            data.rating
        );

        trainerEntity.rating = newAverage;
        trainerEntity.reviewCount = (trainerEntity.reviewCount || 0) + 1;


        await this._trainerRepo.updateTrainer(data.trainerId, trainerEntity);
    }
}