import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_RESEND_OTP_TOKEN, IResendOtpUseCase } from "application/interfaces/auth/i-resend-otp.usecase";
import { I_REFRESH_ACCESS_TOKEN_TOKEN, IRefreshAccessTokenUseCase } from "application/interfaces/auth/i-refresh-access-token.usecase";
import { AUTH_CONSTANTS } from 'utils/Constants';
import { COOKIE_CONFIG } from 'utils/authConfig';
@injectable()
export class SessionController {
    constructor(
        @inject(I_RESEND_OTP_TOKEN)
        private readonly _resendOtpUseCase: IResendOtpUseCase,

        @inject(I_REFRESH_ACCESS_TOKEN_TOKEN)
        private readonly _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
    ) { }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this._resendOtpUseCase.execute(req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.OTP_SENDED
            });
        } catch (error) {
            next(error);
        }
    };

    refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE];

            if (!refreshToken) {
                throw new AppError(ERROR_MESSAGES.REFRESH_TOKEN_MISSING, HttpStatus.BAD_REQUEST)
            }

            const tokenResult = await this._refreshAccessTokenUseCase.execute(refreshToken);

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: tokenResult.accessToken,
                role: tokenResult.role
            });

        } catch (error) {
            next(error);
        }
    };

    logout = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, COOKIE_CONFIG);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    };
}