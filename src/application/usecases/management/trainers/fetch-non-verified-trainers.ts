import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { FetchAllTrainersRequestDTO } from "application/dto/discovery/fetch-all-trainer.request.dto";
import { FetchAllPendingTrainersResponseDTO, FetchAllPendingTrainersResponseSchema } from "application/dto/management/trainer-management/pending-trainers.dto";
@injectable()
export class FetchAllPendingTrainers implements IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(queryInput: FetchAllTrainersRequestDTO): Promise<FetchAllPendingTrainersResponseDTO> {
    const { limit, currentPage, filter } = queryInput;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    const result =
      await this._trainerRepository.findAllTrainers(
        currentPage,
        limit,
        filter || {}
      );

    return FetchAllPendingTrainersResponseSchema.parse({
      data: result.data.map(item => TrainerMapper.toPendingTrainerDTO(item)),
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage,
      totalCount: result.totalCount
    });
  }
}