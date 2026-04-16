

import { TrainerReviewsListsResponseDTO } from "application/dto/review/review-list.dto";
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from "application/interfaces/review/i-get-trainer-review-lists";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";


@injectable()
export class TrainerReviewController {
    constructor(
        @inject(I_GET_TRAINER_REVIEW_LISTS_TOKEN) private _getReviewList:IGetTrainerReviewLists
    ) { }

     getReviewList=async(req: Request, res: Response,next:NextFunction)=>{
        try {
            const { id: trainerId } = req.user as any;
            
            let reviews:TrainerReviewsListsResponseDTO=await this._getReviewList.execute(trainerId)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Review fetched successfully",
                data:reviews
            });
        } catch (error) {
            next(error)
        }
    }
}