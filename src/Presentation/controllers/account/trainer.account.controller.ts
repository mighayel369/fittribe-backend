import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';


import { IReapplyTrainer, I_REAPPLY_TRAINER_TOKEN } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { IVerifySession, I_VERIFY_TRAINER_SESSION_TOKEN } from 'application/interfaces/auth/i-verify-session.usecase';
import { IUpdateProfilePicture, I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN } from "application/interfaces/common/i-update-profile-picture.usecase";
import { IUpdateTrainerProfileUseCase, I_UPDATE_TRAINER_PROFILE_TOKEN } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { IFetchTrainerDetails, I_FETCH_TRAINER_DETAILS_TOKEN } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { IChangePasswordUseCase, I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN } from 'application/interfaces/auth/i-change-password.usecase';
import { TrainerSessionResponseDTO } from 'application/dto/account/trainer/verify-session';
import { TrainerProfileDTO } from 'application/dto/account/trainer/get-trainer-profile.dto';
@injectable()
export class TrainerAccountController {
    constructor(
        @inject(I_REAPPLY_TRAINER_TOKEN)
        private readonly _reapplyTrainerUseCase: IReapplyTrainer,

        @inject(I_VERIFY_TRAINER_SESSION_TOKEN)
        private readonly _verifySessionUseCase: IVerifySession<TrainerSessionResponseDTO>,

        @inject(I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN)
        private readonly _changePasswordUseCase: IChangePasswordUseCase,

        @inject(I_FETCH_TRAINER_DETAILS_TOKEN)
        private readonly _fetchTrainerDetailsUseCase: IFetchTrainerDetails<TrainerProfileDTO>,

        @inject(I_UPDATE_TRAINER_PROFILE_TOKEN)
        private readonly _updateTrainerProfileUseCase: IUpdateTrainerProfileUseCase,

        @inject(I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN)
        private readonly _updateProfilePictureUseCase: IUpdateProfilePicture,
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(
                    ERROR_MESSAGES.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED
                );
            }

            const profileData = await this._fetchTrainerDetailsUseCase.execute(trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                trainer: profileData
            });

        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            

            await this._updateTrainerProfileUseCase.execute(trainerId, req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED
            });
        } catch (err) { next(err); }
    };

    updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.IMAGE_FILE_MISSING, HttpStatus.BAD_REQUEST);
            }

            const updatedAvatar = await this._updateProfilePictureUseCase.execute(trainerId, req.file);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_PICTURE_UPDATED,
                data: updatedAvatar
            });
        } catch (error) {
            next(error);
        }
    };

    verifySession = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const trainerId = req.user?.user.id;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const trainerSession = await this._verifySessionUseCase.execute(trainerId);
            res.status(HttpStatus.OK).json({
                success: true,
                trainer: trainerSession
            });
        } catch (error) {
            next(error);
        }
    };

    reapply = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._reapplyTrainerUseCase.execute(trainerId, req.body, req.file);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.REAPPLY_SUCCESSFULL
            });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._changePasswordUseCase.execute(trainerId, req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.PASSWORD_UPDATED
            });

        } catch (error) {
            next(error);
        }
    };
}