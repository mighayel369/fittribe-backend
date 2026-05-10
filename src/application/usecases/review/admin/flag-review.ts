import { IFlagReview } from "application/interfaces/review/i-flag-review";
import { injectable, inject } from "tsyringe";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FlagReviewUseCase implements IFlagReview {
  constructor(
    @inject(I_REVIEW_REPO_TOKEN)
    private readonly _reviewRepository: IReviewRepo
  ) { }

  async execute(reviewId: string): Promise<void> {
    const reviewEntity = await this._reviewRepository.getReviewById(reviewId);

    if (!reviewEntity) {
      throw new AppError(ERROR_MESSAGES.TRAINER_REVIEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    reviewEntity.isDeleted = !reviewEntity.isDeleted;

    await this._reviewRepository.updateReview(reviewEntity);
  }
}