import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../../interfaces/auth/i-change-password.usecase";
import { ChangePasswordRequestDTO } from "application/dto/auth/change-password.dto";
import { ISecurityService, I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ChangeTrainerPasswordUseCase implements IChangePasswordUseCase<ChangePasswordRequestDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_SECURITY_SERVICE_TOKEN)
    private readonly _securityService: ISecurityService
  ) { }


  async execute(passwordChangeRequest: ChangePasswordRequestDTO): Promise<void> {
    const { userId, oldPassword, newPassword } = passwordChangeRequest;

    if (!oldPassword || !newPassword) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_MISSING, HttpStatus.BAD_REQUEST);
    }

    const trainerAccount = await this._trainerRepository.findTrainerById(userId);

    if (!trainerAccount || !trainerAccount.password) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isCurrentPasswordValid = await this._securityService.comparePassword(
      oldPassword,
      trainerAccount.password
    );

    if (!isCurrentPasswordValid) {
      throw new AppError(ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);
    }

    const hashedNewPassword = await this._securityService.hashPassword(newPassword);

    await this._trainerRepository.updatePassword(userId, hashedNewPassword);
  }
}