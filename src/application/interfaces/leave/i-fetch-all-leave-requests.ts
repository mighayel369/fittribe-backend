import { fetchAllLeaveQueryDTO } from "application/dto/leave/shared/leave-requests.dto";

export const I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN = Symbol("I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN");
export const I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN = Symbol("I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN");

export interface IFetchAllLeaveRequests<responseDTO> {
    execute(input: fetchAllLeaveQueryDTO): Promise<responseDTO>
}