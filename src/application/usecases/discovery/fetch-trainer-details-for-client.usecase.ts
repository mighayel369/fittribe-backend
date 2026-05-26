
import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { UserTrainerViewDTO } from "application/dto/discovery/public-trainer-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";

@injectable()
export class FetchTrainerDetailsForClient
  implements
  IFetchTrainerDetails<
    UserTrainerViewDTO
  > {

  constructor(@inject(I_TRAINER_REPO_TOKEN)
  private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(
    trainerId: string
  ): Promise<UserTrainerViewDTO> {

    const trainerData =
      await this
        ._trainerRepository
        .findTrainerDetails(
          trainerId
        );

    if (!trainerData) {

      throw new AppError(
        ERROR_MESSAGES
          .TRAINER_NOT_FOUND,

        HttpStatus
          .NOT_FOUND
      );
    }

    return TrainerMapper
      .toUserTrainerView(
        trainerData,
        null
      );
  }
}