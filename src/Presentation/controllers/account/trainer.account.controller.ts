import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';


import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerRequestDTO, ReapplyTrainerDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { TrainerSessionDTO } from 'application/dto/auth/verify-session.dto';
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { TrainerPrivateProfileDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { UpdateTrainerProfileDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';

@injectable()
export class TrainerAccountController {
    constructor(
        @inject("TrainerReapplyUsecase") private readonly _reapply: IReapplyTrainer,
        @inject("VerifyTrainerSession") private _verifySessione: IVerifySession<TrainerSessionDTO>,
        @inject("FetchTrainerProfileUseCase") private _getProfile: IFetchTrainerDetails<TrainerPrivateProfileDTO>,
        @inject("TrainerProfileUseCase") private _updateProfile: IUpdateTrainerProfileUseCase,
        @inject("UpdateTrainerProfilePicture") private _updateAvatar: IUpdateProfilePicture,
    ) { }


    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const result = await this._getProfile.execute(id);
            res.status(HttpStatus.OK).json({ success: true, trainer: result });
        } catch (error) { next(error); }
    };
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            await this._updateProfile.execute({
                trainerId: id,
                data: req.body
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED
            });
        } catch (err) { next(err); }
    };
    updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            if (!req.file) throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
            const imageUrl = await this._updateAvatar.execute({ id, profilePic: req.file });
            res.status(HttpStatus.OK).json({ success: true, data: { imageUrl } });
        } catch (error) { next(error); }
    };


    verifySession = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.user as { id: string };
        const trainer = await this._verifySessione.execute(id);
        res.status(HttpStatus.OK).json({ success: true, trainer });
    };

    reapply = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.CERTIFICATE_MISSING, HttpStatus.BAD_REQUEST);
            }

            const input: ReapplyTrainerRequestDTO = {
                trainerId: id,
                data: {
                    ...req.body,
                    certificate: req.file
                }
            };

            const result = await this._reapply.execute(input);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.REAPPLY_SUCCESSFULL,
                data: result
            });
        } catch (error) { next(error); }
    };

}