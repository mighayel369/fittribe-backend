import { inject, injectable } from "tsyringe";
import { IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { AdminReviewListResponseDTO } from "application/dto/review/review-list.dto";
import { ReviewMapper } from "application/mappers/review-mapper";
@injectable()
export class GetAdminReviewsList implements IGetAdminReviewLists {
  constructor(
    @inject(I_REVIEW_REPO_TOKEN)
    private readonly _reviewRepository: IReviewRepo
  ) { }

  async execute(): Promise<AdminReviewListResponseDTO> {
    const rawReviews = await this._reviewRepository.getAdminReviewsList();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalReviews = rawReviews.length;
    const flaggedCount = rawReviews.filter(r => r.reviews.isDeleted === true).length;
    const newToday = rawReviews.filter(r =>
      r.reviews.createdAt && new Date(r.reviews.createdAt) >= startOfToday
    ).length;

    return {
      reviews: rawReviews.map(r => ReviewMapper.toAdminReviewDTO(r)),
      totalReviews,
      flaggedCount,
      newToday
    };
  }
}