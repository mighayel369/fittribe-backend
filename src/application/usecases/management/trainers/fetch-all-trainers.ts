import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { inject, injectable } from "tsyringe";

import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { FetchAllTrainersRequestDTO } from "application/dto/discovery/fetch-all-trainer.request.dto";
import { FetchAllTrainersResponseDTO, FetchAllTrainersResponseSchema } from "application/dto/management/trainer-management/all-trainers.dto";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { TrainerMapper } from "application/mappers/trainer-mapper";

@injectable()
export class FetchAllTrainersUseCase
  implements IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(queryInput: FetchAllTrainersRequestDTO): Promise<FetchAllTrainersResponseDTO> {
    const { limit, currentPage, filter } = queryInput;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }



    const result = await this._trainerRepository.findAllTrainers(currentPage, limit, filter || {});

    return FetchAllTrainersResponseSchema.parse({
      data: result.data.map(item => TrainerMapper.toTrainersResponseDTO(item)),
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage,
      totalCount: result.totalCount
    });
  }
}