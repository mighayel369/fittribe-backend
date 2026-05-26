import { inject, injectable } from "tsyringe";
import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { TrainerProfileDTO } from "application/dto/account/trainer/get-trainer-profile.dto";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";

@injectable()
export class FetchTrainerProfileUseCase implements IFetchTrainerDetails<TrainerProfileDTO> {

  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(trainerId: string): Promise<TrainerProfileDTO> {

    if (!trainerId) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST
      );
    }

    const trainer =await this._trainerRepository.findTrainerDetails(trainerId);

    if (!trainer) {
      throw new AppError(
        ERROR_MESSAGES.TRAINER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return TrainerMapper.toTrainerProfile(trainer);
  }
}