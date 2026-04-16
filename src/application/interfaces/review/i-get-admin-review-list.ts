import { AdminReviewListResponseDTO } from "application/dto/review/review-list.dto";

export const I_GET_ADMIN_REVIEW_LISTS_TOKEN = Symbol("I_GET_ADMIN_REVIEW_LISTS_TOKEN");
export interface IGetAdminReviewLists{
    execute():Promise<AdminReviewListResponseDTO>
}