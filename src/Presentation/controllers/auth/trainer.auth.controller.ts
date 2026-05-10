import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_TRAINER_LOGIN_USECASE_TOKEN, ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { LoginRequestDTO, LoginResponseDTO } from 'application/dto/auth/login.dto';
import { I_TRAINER_REGISTER_USECASE_TOKEN, IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { RegisterResponseDTO, TrainerRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { I_VERIFY_TRAINER_ACCOUNT_TOKEN, IVerifyAccountUseCase } from 'application/interfaces/public/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/public/verify-account.dto';
import { AUTH_CONSTANTS } from 'utils/Constants';
import { COOKIE_CONFIG } from 'utils/authConfig';
@injectable()
export class TrainerAuthController {
    constructor(
        @inject(I_TRAINER_REGISTER_USECASE_TOKEN)
        private readonly _registerTrainerUseCase: IRegisterUseCase<TrainerRegisterRequestDTO>,

        @inject(I_TRAINER_LOGIN_USECASE_TOKEN)
        private readonly _loginTrainerUseCase: ILoginUseCase,

        @inject(I_VERIFY_TRAINER_ACCOUNT_TOKEN)
        private readonly _verifyAccountUseCase: IVerifyAccountUseCase,
    ) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationDetails: TrainerRegisterRequestDTO = req.body;

            if (!req.file) {
                throw new AppError(ERROR_MESSAGES.CERTIFICATE_MISSING, HttpStatus.BAD_REQUEST);
            }

            const registrationResult: RegisterResponseDTO =
                await this._registerTrainerUseCase.execute(registrationDetails, req.file);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.TRAINER_REGISTERATION_SUCCESSFULL,
                email: registrationResult.email,
            });
        } catch (err) {
            next(err);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginCredentials: LoginRequestDTO = req.body;

            const authResult: LoginResponseDTO =
                await this._loginTrainerUseCase.execute(loginCredentials);

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
                trainer: authResult.user
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
}