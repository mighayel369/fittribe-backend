import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import config from "config";
import logger from "utils/logger";
import { IMailService } from "domain/services/i-mail-service";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class MailService implements IMailService {
  private createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD,
      },
    });
  }

  async sendHtmlEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = this.createTransporter();
      await transporter.sendMail({
        from: `"FitTribe Support" <${config.MAIL_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      logger.error(`MailService Error sending to ${to}:`, error);
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}