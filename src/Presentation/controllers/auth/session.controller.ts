import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_RESEND_OTP_TOKEN, IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { RefreshTokenResponseDTO } from "application/dto/public/refresh-token.response.dto";
import { I_REFRESH_ACCESS_TOKEN_TOKEN, IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";

@injectable()
export class SessionController {
    constructor(
        @inject(I_RESEND_OTP_TOKEN) private _resendOtp: IReSendOtpUseCase,
        @inject(I_REFRESH_ACCESS_TOKEN_TOKEN) private _refreshToken: IRefreshAccessTokenUseCase,
    ) { }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, role } = req.body;

            await this._resendOtp.execute({ email, role });

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
            const token = req.cookies.refreshToken;
            if (!token) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING
                });
                return
            }
            const result: RefreshTokenResponseDTO = await this._refreshToken.execute(token);
            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: result.accessToken,
                role: result.role
            });
            return
        } catch (error) {
            next(error)
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