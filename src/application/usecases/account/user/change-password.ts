import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../../interfaces/auth/i-change-password.usecase";
import { ChangePasswordRequestDTO } from "application/dto/auth/change-password.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ChangeUserPasswordUseCase implements IChangePasswordUseCase<ChangePasswordRequestDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService
  ) { }

  async execute(passwordChangeRequest: ChangePasswordRequestDTO): Promise<void> {
    const { userId, oldPassword, newPassword } = passwordChangeRequest;

    if (!oldPassword || !newPassword) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_MISSING, HttpStatus.BAD_REQUEST);
    }

    const userAccount = await this._userRepository.findUserById(userId);

    if (!userAccount || !userAccount.password) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isCurrentPasswordValid = await this._securityService.comparePassword(
      oldPassword,
      userAccount.password
    );

    if (!isCurrentPasswordValid) {
      throw new AppError(ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);
    }

    const hashedNewPassword = await this._securityService.hashPassword(newPassword);

    await this._userRepository.updatePassword(userId, hashedNewPassword);
  }
}