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
import { RegisterResponseDTO, TrainerRegisterRequestDTO } from 'application/dto/auth/register.dto';
import { IVerifyAccountUseCase } from 'application/interfaces/public/i-verify-otp.usecase';
import { VerifyAccountRequestDTO } from 'application/dto/public/verify-account.dto';
@injectable()
export class TrainerAuthController {
    constructor(
        @inject("TrainerRegisterUseCase") private _register: IRegisterUseCase<TrainerRegisterRequestDTO>,
        @inject("TrainerLoginUseCase") private _login: ILoginUseCase,
        @inject("VerifyTrainerAccountUseCase") private _verify: IVerifyAccountUseCase,
    ) { }


register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainerData: TrainerRegisterRequestDTO = req.body;

        if (!req.file) {
            throw new AppError(ERROR_MESSAGES.CERTIFICATE_MISSING, HttpStatus.BAD_REQUEST);
        }

        const result: RegisterResponseDTO = await this._register.execute(trainerData, req.file);

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: SUCCESS_MESSAGES.AUTH.TRAINER_REGISTERATION_SUCCESSFULL,
            email: result.email,
        });
    } catch (err) {
        next(err);
    }
};

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
            message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESSFULL,
            accessToken: result.accessToken,
            role: result.role,
            trainer: result.user
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