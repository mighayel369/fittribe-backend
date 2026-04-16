import { AddReviewDTO } from "application/dto/review/add-review.dto";
export const I_ADD_REVIEW_TOKEN = Symbol("I_ADD_REVIEW_TOKEN");

export interface IAddReview{
    execute(data:AddReviewDTO):Promise<void>
}