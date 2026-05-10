import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_VERIFY_CLIENT_SESSION_TOKEN, IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { ClientSessionDTO } from 'application/dto/auth/verify-session.dto';
import { UserProfileDTO } from 'application/dto/user/user-details.dto';
import { UpdateProfilePictureRequestDTO } from 'application/dto/common/update-profile-picture.dto.';
import { UserProfileUpdateRequestDTO } from 'application/dto/user/update-user-profile.dto';
import { I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { I_UPDATE_USER_PROFILE_TOKEN, IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';
import { I_FETCH_USER_PROFILE_TOKEN, IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { IChangePasswordUseCase, I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN } from 'application/interfaces/auth/i-change-password.usecase';
import { ChangePasswordRequestDTO } from 'application/dto/auth/change-password.dto';
@injectable()
export class UserAccountController {
    constructor(
        @inject(I_VERIFY_CLIENT_SESSION_TOKEN)
        private readonly _verifySessionUseCase: IVerifySession<ClientSessionDTO>,

        @inject(I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN)
        private readonly _changePasswordUseCase: IChangePasswordUseCase<ChangePasswordRequestDTO>,

        @inject(I_FETCH_USER_PROFILE_TOKEN)
        private readonly _fetchUserProfileUseCase: IFetchUserDetailsUseCase<UserProfileDTO>,

        @inject(I_UPDATE_USER_PROFILE_TOKEN)
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,

        @inject(I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN)
        private readonly _updateAvatarUseCase: IUpdateProfilePicture,
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const userProfile: UserProfileDTO = await this._fetchUserProfileUseCase.execute(userId);

            if (!userProfile) {
                throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
                userData: userProfile
            });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const { oldPassword, newPassword } = req.body;

            const passwordPayload: ChangePasswordRequestDTO = {
                oldPassword,
                newPassword,
                userId: userId
            };

            await this._changePasswordUseCase.execute(passwordPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.PASSWORD_UPDATED
            });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }

            const updateProfilePayload: UserProfileUpdateRequestDTO = {
                userId: userId,
                data: req.body
            };

            await this._updateUserProfileUseCase.execute(updateProfilePayload);

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
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.IMAGE_FILE_MISSING, HttpStatus.BAD_REQUEST);
            }

            const avatarUpdatePayload: UpdateProfilePictureRequestDTO = {
                id: userId,
                profilePic: req.file
            };

            const updatedImageUrl = await this._updateAvatarUseCase.execute(avatarUpdatePayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_PICTURE_UPDATED,
                data: { imageUrl: updatedImageUrl }
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
            const sessionData: ClientSessionDTO = await this._verifySessionUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                user: sessionData
            });
        } catch (error) {
            next(error);
        }
    };
}