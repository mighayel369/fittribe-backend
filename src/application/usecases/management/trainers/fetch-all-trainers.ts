import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { inject, injectable } from "tsyringe";

import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO } from "application/dto/trainer/fetch-all-trainers.dto";

import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { ITrainerFilters } from "domain/filters/ITrainerFilters";
import { TRAINER_STATUS } from "domain/constants/trainer-status";

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


    const updatedFilter: ITrainerFilters = {
      ...filter,
      status: TRAINER_STATUS.ACCEPTED
    };

    const result = await this._trainerRepository.findAllTrainers(
      currentPage,
      limit,
      updatedFilter
    );


    return {
      data: result.data.map(item => TrainerMapper.toTrainersResponseDTO(item)),
      total: result.totalCount
    };
  }
}