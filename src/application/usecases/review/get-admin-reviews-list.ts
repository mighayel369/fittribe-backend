import { inject,injectable } from "tsyringe";
import { IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { AdminReviewListResponseDTO } from "application/dto/review/review-list.dto";
import { ReviewMapper } from "application/mappers/review-mapper";

@injectable()
export class GetAdminReviewsList implements IGetAdminReviewLists {
    constructor(
        @inject(I_REVIEW_REPO_TOKEN) private _reviewRepo: IReviewRepo,
        @inject(I_TRAINER_REPO_TOKEN) private _trainerRepo: ITrainerRepo 
    ) {}

    async execute(): Promise<AdminReviewListResponseDTO> {
        const reviewEntities = await this._reviewRepo.getAdminReviewsList();

        const totalReviews = reviewEntities.length;

        const flaggedCount = reviewEntities.filter(r => r.isDeleted).length;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const newToday = reviewEntities.filter(r => {
            const createdAt = r.createdAt ? new Date(r.createdAt) : new Date(0);
            return createdAt >= startOfToday;
        }).length;

        const reviews = reviewEntities.map(review => 
            ReviewMapper.toAdminReviewListResponseMapper(review)
        );

        return {
            reviews,
            totalReviews,
            flaggedCount,
            newToday
        };
    }
}