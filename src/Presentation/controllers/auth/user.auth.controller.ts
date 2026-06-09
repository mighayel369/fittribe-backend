import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_CLIENT_LOGIN_USECASE_TOKEN, ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { I_CLIENT_REGISTER_USECASE_TOKEN, IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { ISendPasswordResetLinkUseCase, I_CLIENT_PASSWORD_RESET_USECASE_TOKEN } from 'application/interfaces/auth/i-send-password-reset-link.usecase';
import { I_VERIFY_USER_ACCOUNT_TOKEN, IVerifyAccountUseCase } from 'application/interfaces/auth/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/auth/shared/verify-account.dto';
import { AUTH_CONSTANTS } from 'utils/Constants';
import { COOKIE_CONFIG } from 'utils/authConfig';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { getOAuthErrorUrl, getOAuthSuccessUrl } from 'utils/UrlHelper';
import { UserRegisterRequestDTO } from 'application/dto/auth/user/user.register.dto';
import { LoginRequestDTO } from 'application/dto/auth/shared/login.request.dto';
import { ResetPasswordRequestDTO } from 'application/dto/auth/shared/reset-password.dto';
import { ForgotPasswordRequestDTO } from 'application/dto/auth/shared/forgot-password.dto';
import { RegisterResponseDTO } from 'application/dto/auth/shared/register.response.dto';
import { I_RESET_PASSWORD_USECASE_TOKEN, IResetPasswordUseCase } from 'application/interfaces/auth/i-reset-password.usecase';


@injectable()
export class UserAuthController {
    constructor(
        @inject(I_CLIENT_REGISTER_USECASE_TOKEN)
        private readonly _registerUserUseCase: IRegisterUseCase<UserRegisterRequestDTO>,

        @inject(I_CLIENT_LOGIN_USECASE_TOKEN)
        private readonly _loginUserUseCase: ILoginUseCase,

        @inject(I_CLIENT_PASSWORD_RESET_USECASE_TOKEN)
        private readonly _sendResetMailUseCase: ISendPasswordResetLinkUseCase,

        @inject(I_RESET_PASSWORD_USECASE_TOKEN)
        private readonly _resetPasswordUseCase: IResetPasswordUseCase,

        @inject(I_VERIFY_USER_ACCOUNT_TOKEN)
        private readonly _verifyAccountUseCase: IVerifyAccountUseCase,
    ) { }


    login = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const loginCredentials = req.body as LoginRequestDTO
            const authResult = await this._loginUserUseCase.execute(loginCredentials);

            res.cookie(
                AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
                authResult.refreshToken,
                COOKIE_CONFIG
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL,
                accessToken: authResult.accessToken,
                role: authResult.role,
                user: authResult.user
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    };

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const registrationDetails = req.body as UserRegisterRequestDTO
            const registrationResult: RegisterResponseDTO = await this._registerUserUseCase.execute(registrationDetails);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_REGISTERED,
                email: registrationResult.email
            });
        } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.body as ForgotPasswordRequestDTO

            await this._sendResetMailUseCase.execute(email);

            res.status(HttpStatus.OK).json({
                success: true,
                message:
                    SUCCESS_MESSAGES.USER.RESET_LINK_SENTED
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const resetPasswordPayload = req.body as ResetPasswordRequestDTO

            await this._resetPasswordUseCase.execute(resetPasswordPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.PASSWORD_UPDATED
            });

        } catch (error) {
            next(error);
        }
    };

    verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const verificationRequest = req.body as VerifyAccountRequestDTO

            await this._verifyAccountUseCase.execute(
                verificationRequest
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY
            });

        } catch (error) {
            next(error);
        }
    };

    googleCallback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const oauthSession = req.user
            if (!oauthSession) {
                return res.redirect(getOAuthErrorUrl(ERROR_MESSAGES.UNAUTHORIZED));
            }

            const { accessToken, user } = oauthSession;
            res.redirect(getOAuthSuccessUrl(accessToken, user))

        } catch (error) {
            next(error);
        }
    };
}