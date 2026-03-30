import { FetchLeaveRequestsInputDTO } from "application/dto/leave/leave-requests.dto";


export interface IFetchAllLeaveRequests<responseDTO>{
    execute(input:FetchLeaveRequestsInputDTO):Promise<responseDTO>
}