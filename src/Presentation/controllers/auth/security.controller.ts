import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { ChangePasswordRequestDTO } from 'application/dto/auth/change-password.dto';
import { IChangePasswordUseCase } from 'application/interfaces/auth/i-change-password.usecase';

@injectable()
export class SecurityController {
    constructor(
        @inject("ChangeUserPasswordUseCase") private _changePassword: IChangePasswordUseCase<ChangePasswordRequestDTO>
        ) { }

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
    logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: config.COOKIE_MAX_AGE
            });

            res.status(HttpStatus.OK).json({
                message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS
            });
        } catch {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            });
        }
    }
}