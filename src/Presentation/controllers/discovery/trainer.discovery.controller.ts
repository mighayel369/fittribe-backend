import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { UserTrainerViewDTO } from 'application/dto/discovery/public-trainer-details.dto';
import { I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { FetchAllClientTrainersResponseDTO } from 'application/dto/discovery/public-trainers.dto';
import { I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from 'application/interfaces/review/i-get-trainer-review-lists';

import { TRAINER_STATUS } from 'domain/constants/trainer-status';

import { TrainerAvailabilityQueryDTO } from 'application/dto/discovery/trainer-slots.dto';
import { FetchAllTrainersRequestDTO } from 'application/dto/discovery/fetch-all-trainer.request.dto';

@injectable()
export class TrainerDiscoveryController {
    constructor(
        @inject(I_FETCH_ALL_CLIENT_TRAINERS_TOKEN)
        private readonly _fetchTrainersUseCase: IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>,

        @inject(I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN)
        private readonly _getTrainerDetailsUseCase: IFetchTrainerDetails<UserTrainerViewDTO>,

        @inject(I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN)
        private readonly _fetchSlotsUseCase: IFetchTrainerAvailableSlotsUseCase,

        @inject(I_GET_TRAINER_REVIEW_LISTS_TOKEN)
        private readonly _getReviewListUseCase: IGetTrainerReviewLists
    ) { }


    exploreTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query as unknown as FetchAllTrainersRequestDTO
            query.filter = {
                ...query.filter,
                status: TRAINER_STATUS.ACCEPTED
            }

            const trainersResult = await this._fetchTrainersUseCase.execute(query)

            res.status(HttpStatus.OK).json({
                success: true,
                ...trainersResult
            });

        } catch (error) {
    
            next(error);
        }
    };

    getTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const trainerData = await this._getTrainerDetailsUseCase.execute(trainerId);
            res.status(HttpStatus.OK).json({
                success: true,
                trainer: trainerData
            });

        } catch (error) {
            next(error);
        }
    };

    getAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { trainerId, date } = req.query as TrainerAvailabilityQueryDTO

            const availableSlots = await this._fetchSlotsUseCase.execute(trainerId, date);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,

                data: availableSlots
            });

        } catch (err) {
            next(err);
        }
    };

    getReviewList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const reviewsData = await this._getReviewListUseCase.execute(
                trainerId
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_REVIEW_FETCHED,
                data: reviewsData
            });

        } catch (error) {
            next(error);
        }
    }
}