import { inject, injectable } from "tsyringe";
import { TrainerReviewsListsResponseDTO } from "application/dto/review/review-list.dto";
import { IGetTrainerReviewLists } from "application/interfaces/review/i-get-trainer-review-lists";
import { I_REVIEW_REPO_TOKEN, IReviewRepo } from "domain/repositories/IReviewRepo";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { ReviewMapper } from "application/mappers/review-mapper";

@injectable()
export class GetTrainerReviewsList implements IGetTrainerReviewLists {
  constructor(
    @inject(I_REVIEW_REPO_TOKEN)
    private readonly _reviewRepository: IReviewRepo,

    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerReviewsListsResponseDTO> {

    const [reviews, trainer] = await Promise.all([
      this._reviewRepository.getTrainerReviewsList(trainerId),
      this._trainerRepository.findTrainerById(trainerId)
    ]);
    return {
      reviews: reviews.map(r => ReviewMapper.toTrainerReviewDTO(r)),
      totalReviewCount: trainer?.reviewCount || 0,
      rating: trainer?.rating || 0
    };
  }
}