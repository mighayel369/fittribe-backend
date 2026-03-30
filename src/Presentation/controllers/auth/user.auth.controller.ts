import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO, LoginResponseDTO } from 'application/dto/auth/login.dto';
import { IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { RegisterResponseDTO, UserRegisterRequestDTO, TrainerRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { ISendPasswordResetLinkUseCase } from 'application/interfaces/auth/i-send-password-reset-link.usecase';
import { ResetPasswordTokenBasedDTO } from 'application/dto/auth/change-password.dto';
import { IChangePasswordUseCase } from 'application/interfaces/auth/i-change-password.usecase';
import { IVerifyAccountUseCase } from 'application/interfaces/public/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/public/verify-account.dto';
@injectable()
export class UserAuthController {
    constructor(
        @inject("UserRegisterUseCase") private _register: IRegisterUseCase<UserRegisterRequestDTO>,
        @inject("UserLoginUseCase") private _login: ILoginUseCase,
        @inject("ISendResetMailUseCase") private _sendResetMail: ISendPasswordResetLinkUseCase,
        @inject("IResetPasswordUseCase") private _resetPassword: IChangePasswordUseCase<ResetPasswordTokenBasedDTO>,
        @inject("VerifyUserAccountUseCase") private _verify: IVerifyAccountUseCase,
    ) { }

login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: LoginRequestDTO = req.body;

        const result: LoginResponseDTO = await this._login.execute(input);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.COOKIE_MAX_AGE
        });

        res.status(HttpStatus.OK).json({
            success: true,
            accessToken: result.accessToken,
            role: result.role,
            user: result.user 
        });
    } catch (error) {
        next(error);
    }
};

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: UserRegisterRequestDTO = req.body;

            const result: RegisterResponseDTO = await this._register.execute(input);
            console.log(result)
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_REGISTERED,
                email: result.email
            });
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._sendResetMail.execute(email);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.RESET_LINK_SENTED
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            let payload: ResetPasswordTokenBasedDTO = {
                token,
                newPassword: password
            }
            await this._resetPassword.execute(payload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.PASSWORD_UPDATED,
            });
        } catch (error) {
            next(error);
        }
    };

    verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp }: VerifyAccountRequestDTO = req.body;

            await this._verify.execute({ email, otp });

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY
            });
        } catch (error) {
            next(error);
        }
    };

}