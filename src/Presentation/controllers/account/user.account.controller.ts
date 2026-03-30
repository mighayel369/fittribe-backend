import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { ClientSessionDTO } from 'application/dto/auth/verify-session.dto';
import { UserProfileDTO } from 'application/dto/user/user-details.dto';
import { UpdateProfilePictureRequestDTO } from 'application/dto/common/update-profile-picture.dto.';
import { UpdateUserProfileDTO, UserProfileUpdateRequestDTO } from 'application/dto/user/update-user-profile.dto';
import { IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';
import { IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
@injectable()

export class UserAccountController {
    constructor(
        @inject("VerifyClientSession") private _verifySession: IVerifySession<ClientSessionDTO>,
        @inject("FetchUserProfileUseCase") private _getProfile: IFetchUserDetailsUseCase<UserProfileDTO>,
        @inject("IUpdateUserProfileUseCase") private _updateProfile: IUpdateUserProfileUseCase,
        @inject("UpdateUserProfilePicture") private _updateAvatar: IUpdateProfilePicture,
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const user: UserProfileDTO = await this._getProfile.execute(id);

            if (!user) {
                throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
                userData: user
            });
        } catch (error) {
            next(error);
        }
    };


    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            const input: UserProfileUpdateRequestDTO = {
                userId: id,
                data: req.body
            };

            await this._updateProfile.execute(input);

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
            const userId = (req.user as { id?: string })?.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.IMAGE_FILE_MISSING, HttpStatus.BAD_REQUEST);
            }

            const input: UpdateProfilePictureRequestDTO = {
                id: userId,
                profilePic: req.file
            };

            const imageUrl = await this._updateAvatar.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROFILE.PROFILE_PICTURE_UPDATED,
                data: { imageUrl }
            });
        } catch (error) {
            next(error);
        }
    };



    verifySession = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.user as { id: string };
        const user: ClientSessionDTO = await this._verifySession.execute(id);

        res.status(HttpStatus.OK).json({
            success: true,
            user
        });
    };
}