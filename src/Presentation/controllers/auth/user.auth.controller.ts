import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_CLIENT_LOGIN_USECASE_TOKEN, ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO, LoginResponseDTO } from 'application/dto/auth/login.dto';
import { I_CLIENT_REGISTER_USECASE_TOKEN, IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { RegisterResponseDTO, UserRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { ISendPasswordResetLinkUseCase } from 'application/interfaces/auth/i-send-password-reset-link.usecase';
import { ResetPasswordTokenBasedDTO } from 'application/dto/auth/change-password.dto';
import { I_RESET_PASSWORD_TOKEN, IChangePasswordUseCase } from 'application/interfaces/auth/i-change-password.usecase';
import { I_VERIFY_USER_ACCOUNT_TOKEN, IVerifyAccountUseCase } from 'application/interfaces/public/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/public/verify-account.dto';
import { AUTH_CONSTANTS } from 'utils/Constants';
import { COOKIE_CONFIG } from 'utils/authConfig';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { getOAuthErrorUrl, getOAuthSuccessUrl } from 'utils/UrlHelper';
@injectable()
export class UserAuthController {
    constructor(
        @inject(I_CLIENT_REGISTER_USECASE_TOKEN)
        private readonly _registerUserUseCase: IRegisterUseCase<UserRegisterRequestDTO>,

        @inject(I_CLIENT_LOGIN_USECASE_TOKEN)
        private readonly _loginUserUseCase: ILoginUseCase,

        @inject(I_RESET_PASSWORD_TOKEN)
        private readonly _sendResetMailUseCase: ISendPasswordResetLinkUseCase,

        @inject(I_RESET_PASSWORD_TOKEN)
        private readonly _resetPasswordUseCase: IChangePasswordUseCase<ResetPasswordTokenBasedDTO>,

        @inject(I_VERIFY_USER_ACCOUNT_TOKEN)
        private readonly _verifyAccountUseCase: IVerifyAccountUseCase,
    ) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginCredentials: LoginRequestDTO = req.body;
            const authResult: LoginResponseDTO = await this._loginUserUseCase.execute(loginCredentials);
            res.cookie(
                AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
                authResult.refreshToken,
                COOKIE_CONFIG
            );

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: authResult.accessToken,
                role: authResult.role,
                user: authResult.user
            });
        } catch (error) {
            next(error);
        }
    };

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationDetails: UserRegisterRequestDTO = req.body;

            const registrationResult: RegisterResponseDTO =
                await this._registerUserUseCase.execute(registrationDetails);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_REGISTERED,
                email: registrationResult.email
            });
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._sendResetMailUseCase.execute(email);

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
            const { password, token } = req.body;

            const resetPasswordPayload: ResetPasswordTokenBasedDTO = {
                token: token,
                newPassword: password
            };

            await this._resetPasswordUseCase.execute(resetPasswordPayload);

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
            const verificationPayload: VerifyAccountRequestDTO = req.body;

            await this._verifyAccountUseCase.execute(verificationPayload);

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
            const authData = req.user as { accessToken: string; user: unknown } | undefined;

            if (!authData) {
                return res.redirect(getOAuthErrorUrl(ERROR_MESSAGES.UNAUTHORIZED));
            }

            const { accessToken, user } = authData;

            res.redirect(getOAuthSuccessUrl(accessToken, user));

        } catch (error) {
            next(error);
        }
    };
}