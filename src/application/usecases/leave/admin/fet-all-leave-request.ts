import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import {
  FetchLeaveRequestsInputDTO,
  FetchAdminLeaveResponseDTO
} from "application/dto/leave/leave-requests.dto";
import { LeaveMapper } from "application/mappers/leave-mapper";
@injectable()
export class FetchAllAdminLeaveRequests implements IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO> {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo,
  ) { }

  async execute(queryInput: FetchLeaveRequestsInputDTO): Promise<FetchAdminLeaveResponseDTO> {
    const { filter, currentPage, limit } = queryInput;

    const result = await this._leaveRepository.getAllLeaveRequests(
      filter,
      currentPage,
      limit
    );

    return {
      data: result.data.map(item => LeaveMapper.toAdminLeaveRequestDTO(item)),
      total: result.totalCount
    };
  }
}