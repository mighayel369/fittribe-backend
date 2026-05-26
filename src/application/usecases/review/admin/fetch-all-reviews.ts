import { inject, injectable } from "tsyringe";
import { IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { AdminReviewListResponseDTO, AdminReviewListResponseSchema } from "application/dto/review/admin/review-list.dto";
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
    const flaggedCount = rawReviews.filter(review => review.isDeleted === true).length;
    const newToday = rawReviews.filter(review => review.createdAt && new Date(review.createdAt) >= startOfToday).length;

    return AdminReviewListResponseSchema.parse({
      reviews: rawReviews.map(review => ReviewMapper.toAdminReviewDTO(review)),
      totalReviews,
      flaggedCount,
      newToday
    });
  }
}