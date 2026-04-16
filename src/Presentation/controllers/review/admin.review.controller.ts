
import { AdminReviewListResponseDTO } from "application/dto/review/review-list.dto";
import { I_GET_ADMIN_REVIEW_LISTS_TOKEN, IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";
import { I_FLAG_REVIEW_TOKEN, IFlagReview } from "application/interfaces/review/i-flag-review";

@injectable()
export class AdminReviewController {
    constructor(
        @inject(I_GET_ADMIN_REVIEW_LISTS_TOKEN) private _getReviewList: IGetAdminReviewLists,
        @inject(I_FLAG_REVIEW_TOKEN) private _flagReview: IFlagReview
    ) { }

    getReviewList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reviews: AdminReviewListResponseDTO = await this._getReviewList.execute()

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Review fetched successfully",
                data: reviews
            });
        } catch (error) {
            next(error)
        }
    }

    flagReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reviewId=req.params.id
            await this._flagReview.execute(reviewId)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Review flaged successfully",
            });
        } catch (error) {
            next(error)
        }
    }

}