import { ResendOtpRequestDTO } from "application/dto/auth/shared/resend-otp.dto";

export const I_RESEND_OTP_TOKEN = Symbol("I_RESEND_OTP_TOKEN");

export interface IResendOtpUseCase {
  execute(input: ResendOtpRequestDTO): Promise<void>;
}