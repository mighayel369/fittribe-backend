import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ADMIN_LOGIN_USECASE_TOKEN, ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO, LoginResponseDTO } from 'application/dto/auth/login.dto';
import { COOKIE_CONFIG } from 'utils/authConfig';
import { AUTH_CONSTANTS } from 'utils/Constants';
@injectable()
export class AdminAuthController {
    constructor(
        @inject(I_ADMIN_LOGIN_USECASE_TOKEN)
        private readonly _adminLoginUseCase: ILoginUseCase
    ) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginCredentials: LoginRequestDTO = req.body;

            const authResult: LoginResponseDTO = await this._adminLoginUseCase.execute(loginCredentials);

            res.cookie(
                AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
                authResult.refreshToken,
                COOKIE_CONFIG
            );

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: authResult.accessToken,
                role: authResult.role,
                admin: authResult.user,
                message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL
            });
        } catch (error) {

            next(error);
        }
    };
}