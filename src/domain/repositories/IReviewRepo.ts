import { ReviewEntity } from "domain/entities/ReviewEntity";
import { ReviewListAggregate } from "./types/review-aggregate.type.ts";
export const I_REVIEW_REPO_TOKEN = Symbol("I_REVIEW_REPO_TOKEN");

export interface IReviewRepo {
    addReview(data: ReviewEntity): Promise<void>
    getTrainerReviewsList(trainerId: string): Promise<ReviewListAggregate[]>
    getAdminReviewsList(): Promise<ReviewListAggregate[]>
    getReviewById(reviewId: string): Promise<ReviewEntity>
    updateReview(data: ReviewEntity): Promise<void>
}