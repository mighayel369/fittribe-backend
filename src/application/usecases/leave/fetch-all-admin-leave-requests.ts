
import { ILeaveRepo } from "domain/repositories/ILeaveRepo";
import { inject,injectable } from "tsyringe";
import { LeaveMapper } from "application/mappers/leave-mapper";
import { IFetchAllLeaveRequests } from "application/interfaces/leave/i-fetch-all-leave-requests";
import { FetchLeaveRequestsInputDTO, FetchAdminLeaveResponseDTO } from "application/dto/leave/leave-requests.dto";
@injectable()
export class FetchAllAdminLeaveRequests implements IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO> {
    constructor(
        @inject("LeaveRepository") private _leaveRepo: ILeaveRepo,
    ) {}

    async execute(input: FetchLeaveRequestsInputDTO): Promise<FetchAdminLeaveResponseDTO> {
        const { searchQuery, filter, currentPage, limit } = input;

        const { data, totalCount } = await this._leaveRepo.getAllLeaveRequests(
            searchQuery, 
            filter, 
            currentPage, 
            limit
        );

        return {
            data: data.map(entity => LeaveMapper.toAdminAllLeaveRequests(entity)),
            total: totalCount
        };
    }
}