
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { inject,injectable } from "tsyringe";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import { FetchLeaveRequestsInputDTO, FetchTrainerLeaveResponseDTO } from "application/dto/leave/leave-requests.dto";
@injectable()
export class FetchAllTrainerLeaveRequests implements IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO> {
    constructor(
        @inject("LeaveRepository") private _leaveRepo: ILeaveRepo,
    ) {}

    async execute(input:FetchLeaveRequestsInputDTO): Promise<FetchTrainerLeaveResponseDTO> {
    const { trainerId, searchQuery,filter, currentPage, limit } = input;

        const {data,totalCount}=await this._leaveRepo.getAllLeaveRequests(searchQuery,{...filter,trainer:trainerId},currentPage,limit)

            return {
              data: data.map(entity => LeaveMapper.toTrainerAllLeaveRequests(entity)),
              total: totalCount
            };
    }
}