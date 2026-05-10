import { inject, injectable } from "tsyringe";
import { TrainerSessionDTO } from "application/dto/auth/verify-session.dto";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AuthMapper } from "application/mappers/auth-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyTrainerSession implements IVerifySession<TrainerSessionDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,
  ) { }


  async execute(trainerId: string): Promise<TrainerSessionDTO> {
    const trainerAccount = await this._trainerRepository.findTrainerById(trainerId);

    if (!trainerAccount) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }


    if (trainerAccount.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.TRAINER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    return AuthMapper.toVerifyTrainerSessionResponseDTO(trainerAccount);
  }
}