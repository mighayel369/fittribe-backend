import { ResendOtpRequestDTO } from "application/dto/public/resend-otp.dto";

export const I_RESEND_OTP_TOKEN = Symbol("I_RESEND_OTP_TOKEN");

export interface IReSendOtpUseCase {
  execute(input: ResendOtpRequestDTO): Promise<void>;
}