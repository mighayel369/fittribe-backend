import { FetchLeaveRequestsInputDTO } from "application/dto/leave/leave-requests.dto";

export const I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN = Symbol("I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN");
export const I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN = Symbol("I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN");

export interface IFetchAllLeaveRequests<responseDTO>{
    execute(input:FetchLeaveRequestsInputDTO):Promise<responseDTO>
}