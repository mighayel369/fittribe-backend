import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../interfaces/auth/i-change-password.usecase";
import { ChangePasswordRequestDTO } from "application/dto/auth/change-password.dto";
import { I_PASSWORD_HASHER_TOKEN, IPasswordHasher } from "domain/services/IPasswordHasher";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ITrainerRepo,I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";

@injectable()
export class ChangeTrainerPasswordUseCase implements IChangePasswordUseCase<ChangePasswordRequestDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo,
    @inject(I_PASSWORD_HASHER_TOKEN) private readonly passwordHasher: IPasswordHasher
  ) {}
  async execute(input:ChangePasswordRequestDTO): Promise<void> {
    let {userId,oldPassword,newPassword}=input
    if (!oldPassword || !newPassword) {
      throw new AppError(ERROR_MESSAGES.PASSWORD_MISSING, HttpStatus.BAD_REQUEST);
    }

    const user = await this._trainerRepo.findTrainerById(userId);

    if (!user || !user.password) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isMatch = await this.passwordHasher.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);
    }

    const hashedNewPassword = await this.passwordHasher.hash(newPassword);
    await this._trainerRepo.updatePassword(userId, hashedNewPassword);
  }
}