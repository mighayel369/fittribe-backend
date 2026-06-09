import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';

import { IGetTrainerWeeklyAvailabilityUseCase, I_GET_TRAINER_WEEKLY_AVAILABILITY_TOKEN } from 'application/interfaces/slot/i-get-trainer-weekly-availability.usecase';
import { IUpdateTrainerWeeklyAvailabilityUseCase, I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { SyncWeeklyAvailabilityRequestDTO } from 'application/dto/schedules/update-slot-config';
@injectable()
export class TrainerScheduleController {
    constructor(
        @inject(I_GET_TRAINER_WEEKLY_AVAILABILITY_TOKEN)
        private readonly _getTrainerSlotsUseCase: IGetTrainerWeeklyAvailabilityUseCase,

        @inject(I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN)
        private readonly _updateWeeklyAvailabilityUseCase: IUpdateTrainerWeeklyAvailabilityUseCase,
    ) { }

    getSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const availabilitySchedule = await this._getTrainerSlotsUseCase.execute(trainerId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED,
                data: availabilitySchedule
            });
        } catch (err) {

            next(err);
        }
    };

    syncWeeklyAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { weeklyAvailability } = req.body as SyncWeeklyAvailabilityRequestDTO
            await this._updateWeeklyAvailabilityUseCase.execute(trainerId, weeklyAvailability);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_WEEKLY_SLOT_UPDATED
            });

        } catch (error) {
            next(error);
        }
    };
}