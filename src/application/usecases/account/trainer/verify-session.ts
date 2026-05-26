import { inject, injectable } from "tsyringe";
import { TrainerSessionResponseDTO } from "application/dto/account/trainer/verify-session";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AuthMapper } from "application/mappers/auth-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyTrainerSessionUseCase implements IVerifySession<TrainerSessionResponseDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerSessionResponseDTO> {

    const trainer = await this._trainerRepository.findTrainerById(trainerId);

    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (trainer.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.TRAINER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    return AuthMapper.toTrainerSessionResponseDTO(trainer);
  }
}