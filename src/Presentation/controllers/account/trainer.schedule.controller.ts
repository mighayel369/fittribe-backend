import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';

import { IGetTrainerSlotConfigurationUseCase,I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
import { IUpdateTrainerWeeklyAvailabilityUseCase,I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
@injectable()
export class TrainerScheduleController {
    constructor(
        @inject(I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN)
        private _getSlots: IGetTrainerSlotConfigurationUseCase,

        @inject(I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN)
        private _updateAvailability: IUpdateTrainerWeeklyAvailabilityUseCase,
    ) { }
    getSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const result: TrainerSlotResponseDTO = await this._getSlots.execute(id);
            res.status(HttpStatus.OK).json({ success: true, message: SUCCESS_MESSAGES.TRAINER.TRAINER_SLOTS_FETCHED, data: result });
        } catch (err) { next(err); }
    };

    syncWeeklyAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            const { weeklyAvailability } = req.body;

            await this._updateAvailability.execute({
                trainerId: id,
                availability: weeklyAvailability
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_WEEKLY_SLOT_UPDATED
            });
        } catch (err) {
            next(err);
        }
    };
}