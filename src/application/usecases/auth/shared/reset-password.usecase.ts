import { inject, injectable } from "tsyringe";
import { IResetPasswordUseCase } from "application/interfaces/auth/i-reset-password.usecase";
import { ResetPasswordRequestDTO } from "application/dto/auth/shared/reset-password.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService
  ) { }

  async execute(resetRequest: ResetPasswordRequestDTO): Promise<void> {

    const { token, password } = resetRequest;
    
    const hashedResetToken = this._securityService.hashToken(token);

    const userAccount = await this._userRepository.findByResetToken(hashedResetToken);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_LINK, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this._securityService.hashPassword(password);

    await this._userRepository.updatePassword(userAccount.userId, hashedPassword);

    await this._userRepository.updateResetToken(userAccount.userId, undefined, undefined);
  }
}