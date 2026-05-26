import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_VERIFY_CLIENT_SESSION_TOKEN, IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { I_UPDATE_USER_PROFILE_TOKEN, IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';
import { I_FETCH_USER_PROFILE_TOKEN, IFetchUserProfileUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { IChangePasswordUseCase, I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN } from 'application/interfaces/auth/i-change-password.usecase';
import { ClientSessionResponseDTO } from 'application/dto/account/user/verify-session.dto';
import { UserProfileResponseDTO } from 'application/dto/account/user/user-details.dto';


@injectable()
export class UserAccountController {
    constructor(
        @inject(I_VERIFY_CLIENT_SESSION_TOKEN)
        private readonly _verifySessionUseCase: IVerifySession<ClientSessionResponseDTO>,

        @inject(I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN)
        private readonly _changePasswordUseCase: IChangePasswordUseCase,

        @inject(I_FETCH_USER_PROFILE_TOKEN)
        private readonly _fetchUserProfileUseCase: IFetchUserProfileUseCase<UserProfileResponseDTO>,

        @inject(I_UPDATE_USER_PROFILE_TOKEN)
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,

        @inject(I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN)
        private readonly _updateAvatarUseCase: IUpdateProfilePicture,
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED
                );
            }

            const userProfile = await this._fetchUserProfileUseCase.execute(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
                data: userProfile
            });

        } catch (error) {
            next(error)
        }
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._changePasswordUseCase.execute(userId, req.body);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.PASSWORD_UPDATED
            });
        } catch (error) {
            next(error);
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }


            await this._updateUserProfileUseCase.execute(userId, req.body);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_DATA_UPDATED
            });
        } catch (error) {
            next(error);
        }
    };

    updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.IMAGE_FILE_MISSING, HttpStatus.BAD_REQUEST);
            }
            const updatedAvatar = await this._updateAvatarUseCase.execute(userId, req.file);

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
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }

            const sessionData = await this._verifySessionUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                user: sessionData
            });
        } catch (error) {
            next(error);
        }
    };
}