import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";
export const I_APPLY_LEAVE_REQUEST_TOKEN = Symbol("I_APPLY_LEAVE_REQUEST_TOKEN");

export interface IApplyLeaveRequest{
    execute(input:RequestLeaveDTO):Promise<void>
}