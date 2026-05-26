
import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import { FetchAdminLeaveResponseDTO } from "application/dto/leave/admin/leave-list.dto"; import { LeaveMapper } from "application/mappers/leave-mapper";
import { fetchAllLeaveQueryDTO } from "application/dto/leave/shared/leave-requests.dto";

@injectable()
export class FetchAllAdminLeaveRequests implements IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO> {

  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo
  ) { }

  async execute(queryInput: fetchAllLeaveQueryDTO): Promise<FetchAdminLeaveResponseDTO> {

    const { filter, currentPage, limit } = queryInput;

    const result = await this._leaveRepository.getAllLeaveRequests(
      filter || {},
      currentPage,
      limit
    );

    const mappedData =
      result.data.map(item =>
        LeaveMapper.toAdminLeaveResponseDTO(item)
      );

    return LeaveMapper
      .toFetchAdminLeaveResponseDTO(
        mappedData,
        result.totalCount,
        currentPage,
        limit
      );
  }
}