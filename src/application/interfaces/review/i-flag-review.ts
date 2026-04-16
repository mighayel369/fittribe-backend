export const I_FLAG_REVIEW_TOKEN = Symbol("I_FLAG_REVIEW_TOKEN");

export interface IFlagReview{
    execute(reviewId:string):Promise<void>
}