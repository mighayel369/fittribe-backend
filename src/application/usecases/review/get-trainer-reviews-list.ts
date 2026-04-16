import { TrainerReviewsListsResponseDTO } from "application/dto/review/review-list.dto";
import { IGetTrainerReviewLists } from "application/interfaces/review/i-get-trainer-review-lists";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { inject,injectable } from "tsyringe";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ReviewMapper } from "application/mappers/review-mapper";

@injectable()
export class GetTrainerReviewsList implements IGetTrainerReviewLists {
    constructor(
        @inject(I_REVIEW_REPO_TOKEN) private _reviewRepo: IReviewRepo,
        @inject(I_TRAINER_REPO_TOKEN) private _trainerRepo: ITrainerRepo 
    ) {}

    async execute(trainerId: string): Promise<TrainerReviewsListsResponseDTO> {

        const reviewsEntity = await this._reviewRepo.getTrainerReviewsList(trainerId);
        const trainer = await this._trainerRepo.findTrainerById(trainerId);

        const reviewListDTOs = reviewsEntity.map(entity => 
            ReviewMapper.toTrainersReviewListResponse(entity)
        );

        return {
            reviews: reviewListDTOs,
            totalReviewCount: trainer?.reviewCount || 0,
            rating: trainer?.rating || 0
        };
    }
}