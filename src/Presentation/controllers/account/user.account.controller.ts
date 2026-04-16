import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_VERIFY_CLIENT_SESSION_TOKEN, IVerifySession } from 'application/interfaces/auth/i-verify-session.usecase';
import { ClientSessionDTO } from 'application/dto/auth/verify-session.dto';
import { UserProfileDTO } from 'application/dto/user/user-details.dto';
import { UpdateProfilePictureRequestDTO } from 'application/dto/common/update-profile-picture.dto.';
import { UpdateUserProfileDTO, UserProfileUpdateRequestDTO } from 'application/dto/user/update-user-profile.dto';
import { I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, IUpdateProfilePicture } from 'application/interfaces/common/i-update-profile-picture.usecase';
import { I_UPDATE_USER_PROFILE_TOKEN, IUpdateUserProfileUseCase } from 'application/interfaces/user/i-update-user-profile.usecase';
import { I_FETCH_USER_PROFILE_TOKEN, IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { IChangePasswordUseCase,I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN } from 'application/interfaces/auth/i-change-password.usecase';
import { ChangePasswordRequestDTO } from 'application/dto/auth/change-password.dto';
@injectable()

export class UserAccountController {
constructor(
        @inject(I_VERIFY_CLIENT_SESSION_TOKEN) 
        private _verifySession: IVerifySession<ClientSessionDTO>,
        
        @inject(I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN) 
        private _changePassword: IChangePasswordUseCase<ChangePasswordRequestDTO>,

        @inject(I_FETCH_USER_PROFILE_TOKEN) 
        private _getProfile: IFetchUserDetailsUseCase<UserProfileDTO>,
        
        @inject(I_UPDATE_USER_PROFILE_TOKEN) 
        private _updateProfile: IUpdateUserProfileUseCase,
        
        @inject(I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN) 
        private _updateAvatar: IUpdateProfilePicture,
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

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as { id: string }).id;
    
            const { oldPassword, newPassword } = req.body; 
            
            const payload: ChangePasswordRequestDTO = {
                oldPassword,
                newPassword,
                userId
            };
    
            await this._changePassword.execute(payload);
    
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
            console.log(input)

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