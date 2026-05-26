import { inject, injectable } from "tsyringe";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import { FetchTrainerLeaveResponseDTO, FetchTrainerLeaveResponseSchema } from "application/dto/leave/trainer/leave-lists.dto";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { fetchAllLeaveQueryDTO } from "application/dto/leave/shared/leave-requests.dto";


@injectable()
export class FetchAllTrainerLeaveRequests implements IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO> {
  constructor(
    @inject(I_LEAVE_REPO_TOKEN)
    private readonly _leaveRepository: ILeaveRepo,
  ) { }

  async execute(queryInput: fetchAllLeaveQueryDTO): Promise<FetchTrainerLeaveResponseDTO> {
    const { filter, currentPage, limit } = queryInput;




    const result = await this._leaveRepository.getAllLeaveRequests(
      filter,
      currentPage,
      limit
    );

    const mappedData = result.data.map(item => LeaveMapper.toTrainerLeaveRequestDTO(
      item
    )
    );

    return FetchTrainerLeaveResponseSchema.parse({
      data: mappedData,
      totalCount: result.totalCount,
      currentPage,
      totalPages: Math.ceil(result.totalCount / limit)
    });
  }
}