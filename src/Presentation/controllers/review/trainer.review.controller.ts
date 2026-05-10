import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TrainerReviewsListsResponseDTO } from "application/dto/review/review-list.dto";
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from "application/interfaces/review/i-get-trainer-review-lists";
import { HttpStatus } from "utils/HttpStatus";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class TrainerReviewController {
    constructor(
        @inject(I_GET_TRAINER_REVIEW_LISTS_TOKEN)
        private readonly _getTrainerReviewListUseCase: IGetTrainerReviewLists
    ) { }

    getReviewList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const reviewHistory: TrainerReviewsListsResponseDTO =
                await this._getTrainerReviewListUseCase.execute(trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_REVIEW_FETCHED,
                data: reviewHistory
            });
        } catch (error) {
            next(error);
        }
    }
}