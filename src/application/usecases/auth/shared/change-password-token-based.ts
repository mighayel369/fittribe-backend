import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../../interfaces/auth/i-change-password.usecase";
import { ResetPasswordTokenBasedDTO } from "application/dto/auth/change-password.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ResetPasswordUseCase implements IChangePasswordUseCase<ResetPasswordTokenBasedDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _passwordHasher: ISecurityService
  ) { }

  async execute(resetRequest: ResetPasswordTokenBasedDTO): Promise<void> {
    const { token, newPassword } = resetRequest;

    const secureTokenHash = this._passwordHasher.hashToken(token);

    const userAccount = await this._userRepository.findByResetToken(secureTokenHash);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_LINK, HttpStatus.BAD_REQUEST);
    }


    const hashedNewPassword = await this._passwordHasher.hashPassword(newPassword);

    await this._userRepository.updatePassword(userAccount.userId, hashedNewPassword);

    await this._userRepository.updateResetToken(userAccount.userId, undefined, undefined);
  }
}