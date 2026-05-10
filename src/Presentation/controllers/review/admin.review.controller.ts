import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AdminReviewListResponseDTO } from "application/dto/review/review-list.dto";
import { I_GET_ADMIN_REVIEW_LISTS_TOKEN, IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";
import { I_FLAG_REVIEW_TOKEN, IFlagReview } from "application/interfaces/review/i-flag-review";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ReviewParams } from "Presentation/interfaces/request.params";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";

@injectable()
export class AdminReviewController {
    constructor(
        @inject(I_GET_ADMIN_REVIEW_LISTS_TOKEN)
        private readonly _getAdminReviewListUseCase: IGetAdminReviewLists,

        @inject(I_FLAG_REVIEW_TOKEN)
        private readonly _flagReviewUseCase: IFlagReview
    ) { }

    getReviewList = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewModerationList: AdminReviewListResponseDTO =
                await this._getAdminReviewListUseCase.execute();

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_REVIEW_FETCHED,
                data: reviewModerationList
            });
        } catch (error) {
            next(error);
        }
    }


    flagReview = async (req: Request<ReviewParams>, res: Response, next: NextFunction) => {
        try {
            const { reviewId } = req.params;

            if (!reviewId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._flagReviewUseCase.execute(reviewId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_REVIEW_FLAGGED
            });
        } catch (error) {
            next(error);
        }
    }
}