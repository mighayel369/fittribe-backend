
import { inject, injectable } from "tsyringe";
import { ISendPasswordResetLinkUseCase } from "application/interfaces/auth/i-send-password-reset-link.usecase";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { IMailService, I_EMAIL_SERVICE_TOKEN } from "domain/services/i-mail-service";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { getPasswordResetUrl } from "utils/UrlHelper";
import { getResetPasswordDetails } from "../templates/emailTemplates";

@injectable()
export class SendPasswordResetLinkUseCase implements ISendPasswordResetLinkUseCase {

  constructor(

    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_EMAIL_SERVICE_TOKEN)
    private readonly _mailService: IMailService,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService
  ) { }

  async execute(email: string): Promise<void> {

    const userAccount =
      await this._userRepository.findUserByEmail(email);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const { rawToken, hashedToken } = this._securityService.generateSecureToken();

    const tokenExpiryTimestamp = Date.now() + 1000 * 60 * 15;

    await this._userRepository.updateResetToken(userAccount.userId, hashedToken, tokenExpiryTimestamp);

    const resetPasswordUrl = getPasswordResetUrl(rawToken);

    const { subject, htmlContent } = getResetPasswordDetails(resetPasswordUrl);

    await this._mailService.sendHtmlEmail(userAccount.email, subject, htmlContent);
  }
}