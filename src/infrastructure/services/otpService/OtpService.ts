import { IOtpService } from "domain/services/IOtpService";
import { OtpModel } from "infrastructure/database/models/OtpModel";
import { OtpEntity } from "domain/entities/OtpEntity";
import { injectable, inject } from "tsyringe";
import logger from "utils/logger";
import { IMailService, I_EMAIL_SERVICE_TOKEN } from "domain/services/i-mail-service";
import { UserRole } from "domain/constants/user-role";

@injectable()
export class OtpService implements IOtpService {

  constructor(
    @inject(I_EMAIL_SERVICE_TOKEN) private _mailService: IMailService
  ) { }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string, role: UserRole): Promise<boolean> {
    try {
      const otp = this.generateOtp();
      const subject = "FitTribe OTP Verification";
      const html = `<p>Your OTP is <b>${otp}</b>. It will expire shortly.</p>`;

      await this._mailService.sendHtmlEmail(email, subject, html);
      await OtpModel.create({ email, otp, role });

      return true;
    } catch (error) {
      logger.error("OTP Flow Error:", error);
      return false;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<OtpEntity | null> {
    try {
      const record = await OtpModel.findOne({ email, otp });
      if (!record) return null;

      await OtpModel.deleteOne({ _id: record._id });
      return new OtpEntity(record.email, record.otp, record.role);
    } catch {
      return null;
    }
  }
}