import { ReviewEntity } from "domain/entities/ReviewEntity";

export const I_REVIEW_REPO_TOKEN = Symbol("I_REVIEW_REPO_TOKEN");

export interface IReviewRepo{
    addReview(data:ReviewEntity):Promise<void>
    getTrainerReviewsList(trainerId:string):Promise<ReviewEntity[]>
    getAdminReviewsList():Promise<ReviewEntity[]>
    getReviewById(reviewId:string):Promise<ReviewEntity>
    updateReview(data:ReviewEntity):Promise<void>
}