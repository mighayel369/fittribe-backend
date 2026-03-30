import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { UserTrainerViewDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { TrainerFilter } from 'domain/entities/TrainerEntity';
import { IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { IFetchTrainerAvailableSlotsUseCase } from 'application/interfaces/slot/i-fetch-trainer-available-slots.usecase';
import { FetchAvailableSlotResponseDTO, FetchAvailableSlotsRequestDTO } from 'application/dto/slot/fetch-trainer-available-slots.dto';
@injectable()
export class TrainerDiscoveryController {
    constructor(
        @inject("FindAllClientTrainersUseCase") private _getList: IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>,
        @inject("FetchTrainerDetailsForClient") private _getDetails: IFetchTrainerDetails<UserTrainerViewDTO>,
        @inject("FetchAvailableSlotUseCase") private _fetchSlots: IFetchTrainerAvailableSlotsUseCase,
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
            const result = await this._getDetails.execute(req.params.id);
            res.status(HttpStatus.OK).json({ success: true, trainer: result });
        } catch (error) { next(error); }
    };

getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const trainerId = req.query.trainerId as string;
        const date = req.query.date as string;
        console.log(trainerId,date)
        if (!trainerId || !date) {
            throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_SLOTS_DATA, HttpStatus.BAD_REQUEST);
        }
        
        let input: FetchAvailableSlotsRequestDTO = { trainerId, date };
        const slots:FetchAvailableSlotResponseDTO = await this._fetchSlots.execute(input);
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

}