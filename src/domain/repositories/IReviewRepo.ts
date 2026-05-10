import { ReviewEntity } from "domain/entities/ReviewEntity";
import { ReviewsList } from "./types/review-type";
export const I_REVIEW_REPO_TOKEN = Symbol("I_REVIEW_REPO_TOKEN");

export interface IReviewRepo {
    addReview(data: ReviewEntity): Promise<void>
    getTrainerReviewsList(trainerId: string): Promise<ReviewsList[]>
    getAdminReviewsList(): Promise<ReviewsList[]>
    getReviewById(reviewId: string): Promise<ReviewEntity>
    updateReview(data: ReviewEntity): Promise<void>
}