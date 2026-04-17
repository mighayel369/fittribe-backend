import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { I_ADD_REVIEW_TOKEN, IAddReview } from "application/interfaces/review/i-add-review";
import { AddReviewDTO } from "application/dto/review/add-review.dto";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class UserReviewController {
    constructor(
        @inject(I_ADD_REVIEW_TOKEN) private _addReviewUseCase: IAddReview
    ) { }

     addReview=async(req: Request, res: Response,next:NextFunction)=>{
        try {
            const { rating, comment, trainerId, bookingId } = req.body;
            const { id: userId } = req.user as { id: string };
            let input: AddReviewDTO = {
                rating,
                comment,
                trainerId,
                bookingId,
                userId
            }
            await this._addReviewUseCase.execute(input);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Review submitted successfully"
            });
        } catch (error) {
            next(error)
        }
    }
}