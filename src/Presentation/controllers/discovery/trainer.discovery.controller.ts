import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { UserTrainerViewDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { TrainerFilter } from 'domain/entities/TrainerEntity';
import { I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from 'application/dto/slot/fetch-trainer-available-slots.dto';
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from 'application/interfaces/review/i-get-trainer-review-lists';

@injectable()
export class TrainerDiscoveryController {
    constructor(
        @inject(I_FETCH_ALL_CLIENT_TRAINERS_TOKEN) private _getList: IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>,
        @inject(I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN) private _getDetails: IFetchTrainerDetails<UserTrainerViewDTO>,
        @inject(I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN) private _fetchSlots: IFetchTrainerAvailableSlotsUseCase,
        @inject(I_GET_TRAINER_REVIEW_LISTS_TOKEN) private _getReviewList: IGetTrainerReviewLists
    ) { }

    exploreTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: TrainerFilter = {
                gender: req.query.gender as any,
                programId: req.query.programs as string,
                sort: req.query.sort as any
            };
            const result = await this._getList.execute({
                searchQuery: req.query.search?.toString() || "",
                currentPage: Math.max(1, Number(req.query.pageNO) || 1),
                limit: 5,
                filter: filters
            });
            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) { next(error); }
    };

    getTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params
            if (!trainerId) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST)
            const result = await this._getDetails.execute(trainerId);
            res.status(HttpStatus.OK).json({ success: true, trainer: result });
        } catch (error) { next(error); }
    };

    getAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.query.trainerId as string;
            const date = req.query.date as string;
            if (!trainerId || !date) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_SLOTS_DATA, HttpStatus.BAD_REQUEST);
            }

            let input: FetchAvailableSlotsRequestDTO = { trainerId, date };
            const slots: FetchAvailableSlotResponseDTO = await this._fetchSlots.execute(input);
            console.log(slots)
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,
                data: slots
            });
        } catch (err) {
            next(err);
        }
    };


    getReviewList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {trainerId}=req.params
            if (!trainerId) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST)
            let reviews = await this._getReviewList.execute(trainerId)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Review fetched successfully",
                data: reviews
            });
        } catch (error) {
            next(error)
        }
    }

}