import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_TRAINER_LOGIN_USECASE_TOKEN, ILoginUseCase } from 'application/interfaces/auth/i-login.usecase';
import { I_TRAINER_REGISTER_USECASE_TOKEN, IRegisterUseCase } from 'application/interfaces/auth/i-register.usecase';
import { I_VERIFY_TRAINER_ACCOUNT_TOKEN, IVerifyAccountUseCase } from 'application/interfaces/auth/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/auth/shared/verify-account.dto';
import { AUTH_CONSTANTS } from 'utils/Constants';
import { COOKIE_CONFIG } from 'utils/authConfig';
import { TrainerRegisterRequestDTO } from 'application/dto/auth/trainer/trainer.register.dto';
import { LoginResponseDTO } from 'application/dto/auth/shared/login.response.dto';
import { RegisterResponseDTO } from 'application/dto/auth/shared/register.response.dto';
import { LoginRequestDTO } from 'application/dto/auth/shared/login.request.dto';

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
            let registerPayload=req.body as TrainerRegisterRequestDTO
            const registrationResult: RegisterResponseDTO = await this._registerTrainerUseCase.execute(registerPayload, req.file);

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
            const loginPayload=req.body as LoginRequestDTO
            const authResult: LoginResponseDTO = await this._loginTrainerUseCase.execute(req.body);

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
            const verificationPayload = req.body as VerifyAccountRequestDTO
            await this._verifyAccountUseCase.execute(
                verificationPayload
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.AUTH.AUTHORIZED_SUCCESSFULLY
            });
        } catch (error) {
            next(error);
        }
    };
}