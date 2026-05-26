
import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { FetchAllClientTrainersResponseDTO, FetchAllClientTrainersResponseSchema } from "application/dto/discovery/public-trainers.dto";
import { FetchAllTrainersRequestDTO } from "application/dto/discovery/fetch-all-trainer.request.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { TRAINER_STATUS } from "domain/constants/trainer-status";


@injectable()
export class FetchAllClientTrainersUseCase implements IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO> {

  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(queryInput: FetchAllTrainersRequestDTO): Promise<FetchAllClientTrainersResponseDTO> {

    const {
      limit,
      currentPage,
      filter
    } = queryInput;

    if (
      currentPage <= 0 ||
      limit <= 0
    ) {
      throw new AppError("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    const updatedFilter = {
      ...filter,
      status: TRAINER_STATUS.ACCEPTED
    };

    const trainerResult = await this._trainerRepository.findAllTrainers(
      currentPage,
      limit,
      updatedFilter
    );



    const mappedData = trainerResult.data.map(item =>
      TrainerMapper.toClientTrainerDTO(item)
    );

    return FetchAllClientTrainersResponseSchema.parse({
      data: mappedData,
      totalPages: Math.ceil(trainerResult.totalCount / limit),
      currentPage,
      totalCount: trainerResult.totalCount
    });
  }
}