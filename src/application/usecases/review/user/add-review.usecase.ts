import { inject, injectable } from "tsyringe";
import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { IAddReview } from "application/interfaces/review/i-add-review";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ReviewMapper } from "application/mappers/review-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { CalculateAverageRating } from "utils/CalculateAvgRating";

@injectable()
export class AddReviewUseCase implements IAddReview {
  constructor(
    @inject(I_REVIEW_REPO_TOKEN) private readonly _reviewRepository: IReviewRepo,
    @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepository: IBookingRepo,
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(reviewPayload: AddReviewDTO): Promise<void> {
    const booking = await this._bookingRepository.findBookingById(reviewPayload.bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const reviewEntity = ReviewMapper.toEntity(reviewPayload);
    await this._reviewRepository.addReview(reviewEntity);


    booking.isReviewed = true;
    await this._bookingRepository.updateBooking(reviewPayload.bookingId, booking);


    const trainer = await this._trainerRepository.findTrainerById(reviewPayload.trainerId);
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const newAverage = CalculateAverageRating(
      trainer.rating || 0,
      trainer.reviewCount || 0,
      reviewPayload.rating
    );

    trainer.rating = newAverage;
    trainer.reviewCount = (trainer.reviewCount || 0) + 1;

    await this._trainerRepository.updateTrainer(reviewPayload.trainerId, trainer);
  }
}