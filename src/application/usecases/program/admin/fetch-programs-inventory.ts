import { inject, injectable } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IFetchProgramInventory } from "application/interfaces/program/i-fetch-program-summary";
import {
  FetchProgramInventoryRequestDTO,
  FetchProgramInventoryResponseDTO
} from "application/dto/programs/program-summary.dto";
import { ProgramMapper } from "application/mappers/program-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchProgramInventory implements IFetchProgramInventory {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN)
    private readonly _programRepository: IProgramRepo
  ) { }

  async execute(queryInput: FetchProgramInventoryRequestDTO): Promise<FetchProgramInventoryResponseDTO> {
    const { currentPage, limit, filter } = queryInput;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError(ERROR_MESSAGES.INVALID_PAGINATION, HttpStatus.BAD_REQUEST);
    }

    const { data, totalCount } = await this._programRepository.findProgramInventory(
      currentPage,
      limit,
      filter || {}
    );

    return {
      data: data.map(program => ProgramMapper.toProgramSummaryDTO(program)),
      total: totalCount
    };
  }
}