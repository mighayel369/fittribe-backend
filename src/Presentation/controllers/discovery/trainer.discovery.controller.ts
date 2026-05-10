import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { UserTrainerViewDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from 'application/dto/slot/fetch-trainer-available-slots.dto';
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from 'application/interfaces/review/i-get-trainer-review-lists';
import { trainerParams } from 'Presentation/interfaces/request.params';
import { TrainerSortOptions } from 'utils/Constants';
import { TRAINER_STATUS } from 'domain/constants/trainer-status';
import { GENDER } from 'domain/constants/gender';

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

    private isTrainerSortOption = (value: unknown): value is TrainerSortOptions => {
        return Object.values(TrainerSortOptions).includes(value as TrainerSortOptions);
    };

    private isGender = (value: unknown): value is GENDER => {
        return typeof value === 'string' && Object.values(GENDER).includes(value as GENDER);
    };

    exploreTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search, gender, programs, sort, pageNo } = req.query;

            const searchStr = typeof search === 'string' ? search : "";

            const genderStr = this.isGender(gender) ? gender : undefined;
            const programIdStr = typeof programs === 'string' ? programs : undefined;


            const sortOption = this.isTrainerSortOption(sort) ? sort : undefined;

            const parsedPage = typeof pageNo === 'string' ? parseInt(pageNo, 10) : 1;
            const currentPage = (isNaN(parsedPage) || parsedPage <= 0) ? 1 : parsedPage;


            const trainersResult = await this._fetchTrainersUseCase.execute({
                currentPage,
                limit: 5,
                filter: {
                    search: searchStr,
                    gender: genderStr,
                    programId: programIdStr,
                    sort: sortOption,
                    status: TRAINER_STATUS.ACCEPTED
                }
            });

            res.status(HttpStatus.OK).json({
                success: true,
                ...trainersResult
            });
        } catch (error) {
            next(error);
        }
    };

    getTrainerDetails = async (req: Request<trainerParams>, res: Response, next: NextFunction) => {
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
            const trainerId = req.query.trainerId
            if (typeof trainerId !== "string") {
                throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
            }
            const date = req.query.date

            if (typeof date !== "string") {
                throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
            }

            const fetchPayload: FetchAvailableSlotsRequestDTO = { trainerId, date };
            const availableSlots: FetchAvailableSlotResponseDTO = await this._fetchSlotsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,
                data: availableSlots
            });
        } catch (err) {
            next(err);
        }
    };

    getReviewList = async (req: Request<trainerParams>, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const reviewsData = await this._getReviewListUseCase.execute(trainerId);

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