import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { AdminTrainerDetails } from "application/dto/trainer/fetch-trainer-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";

@injectable()
export class FetchTrainerDetailsForAdmin implements IFetchTrainerDetails<AdminTrainerDetails> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(trainerId: string): Promise<AdminTrainerDetails> {
    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const data = await this._trainerRepository.findTrainerDetails(trainerId);

    if (!data) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return TrainerMapper.toAdminTrainerDetails(data);
  }
}