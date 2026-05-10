import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { FetchAllClientTrainersResponseDTO, FetchAllTrainersRequestDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { ITrainerFilters } from "domain/filters/ITrainerFilters";

@injectable()
export class FetchAllClientTrainersUseCase implements IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(queryInput: FetchAllTrainersRequestDTO): Promise<FetchAllClientTrainersResponseDTO> {
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
      data: result.data.map(item => TrainerMapper.toClientTrainerDTO(item)),
      total: result.totalCount
    };
  }
}