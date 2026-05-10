import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import {
  FetchLeaveRequestsInputDTO,
  FetchTrainerLeaveResponseDTO
} from "application/dto/leave/leave-requests.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { ILeaveFilters } from "domain/filters/ILeaveFilters";

@injectable()
export class FetchAllTrainerLeaveRequests implements IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO> {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo,
  ) { }

  async execute(queryInput: FetchLeaveRequestsInputDTO): Promise<FetchTrainerLeaveResponseDTO> {
    const { trainerId, filter, currentPage, limit } = queryInput;

    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    const domainFilters: ILeaveFilters = {
      ...(filter || {}),
      trainerId: trainerId
    };

    const result = await this._leaveRepository.getAllLeaveRequests(
      domainFilters,
      currentPage,
      limit
    );

    return {
      data: result.data.map(item => LeaveMapper.toTrainerLeaveRequestDTO(item)),
      total: result.totalCount
    };
  }
}