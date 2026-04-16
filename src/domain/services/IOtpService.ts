import { OtpEntity } from "domain/entities/OtpEntity";

export const I_OTP_SERVICE_TOKEN = Symbol("I_OTP_SERVICE_TOKEN");

export interface IOtpService {
  sendOtp(email: string,role:string): Promise<boolean>;
  verifyOtp(email: string, otp: string): Promise<OtpEntity|null>;
  sendResetEmail(email: string, resetLink: string): Promise<void>;
  sendEmail(to:string,Message:String,MessageType:string):Promise<void>
}