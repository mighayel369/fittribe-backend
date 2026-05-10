import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { I_ADD_REVIEW_TOKEN, IAddReview } from "application/interfaces/review/i-add-review";
import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { HttpStatus } from "utils/HttpStatus";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class UserReviewController {
    constructor(
        @inject(I_ADD_REVIEW_TOKEN)
        private readonly _addReviewUseCase: IAddReview
    ) { }

    addReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rating, comment, trainerId, bookingId } = req.body;
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const reviewSubmissionRequest: AddReviewDTO = {
                rating,
                comment,
                trainerId,
                bookingId,
                userId: userId
            };

            await this._addReviewUseCase.execute(reviewSubmissionRequest);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_REVIEW_SUBMITTED
            });
        } catch (error) {
            next(error);
        }
    }
}