import { IFlagReview } from "application/interfaces/review/i-flag-review";
import { injectable, inject } from "tsyringe";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";

@injectable()
export class FlagReviewUseCase implements IFlagReview {
  constructor(@inject(I_REVIEW_REPO_TOKEN) private _reviewRepo: IReviewRepo) {}

  async execute(reviewId: string): Promise<void> {
    
    const reviewEntity = await this._reviewRepo.getReviewById(reviewId);
   reviewEntity.isDeleted= !reviewEntity.isDeleted, 

    await this._reviewRepo.updateReview(reviewEntity);
  }
}