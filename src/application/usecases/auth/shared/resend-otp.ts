import { inject, injectable } from "tsyringe";
import { I_OTP_SERVICE_TOKEN, IOtpService } from "domain/services/IOtpService";
import { ResendOtpRequestDTO } from "application/dto/public/resend-otp.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ReSendOtpUseCase implements IReSendOtpUseCase {
  constructor(
    @inject(I_OTP_SERVICE_TOKEN)
    private readonly _otpService: IOtpService
  ) { }


  async execute(otpRequest: ResendOtpRequestDTO): Promise<void> {
    const { email, role } = otpRequest;

    const isOtpSentSuccessfully = await this._otpService.sendOtp(email, role);

    if (!isOtpSentSuccessfully) {
      throw new AppError(
        ERROR_MESSAGES.OTP_GENERATE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}