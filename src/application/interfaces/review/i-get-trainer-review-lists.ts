import { TrainerReviewsListsResponseDTO } from "application/dto/review/trainer/review-list.dto";
export const I_GET_TRAINER_REVIEW_LISTS_TOKEN = Symbol("I_GET_TRAINER_REVIEW_LISTS_TOKEN");

export interface IGetTrainerReviewLists {
    execute(trainerId: string): Promise<TrainerReviewsListsResponseDTO>
}