import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO, LoginResponseDTO } from 'application/dto/auth/login.dto';
@injectable()
export class AdminAuthController {
    constructor(
        @inject("AdminLoginUsecase") private _adminLogin: ILoginUseCase
    ) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: LoginRequestDTO = req.body

            const result: LoginResponseDTO = await this._adminLogin.execute(input);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: config.COOKIE_MAX_AGE
            });

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: result.accessToken,
                role: result.role,
                admin:result.user,
                message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL
            });
        } catch (error) {
            next(error);
        }
    };
}