import { RequestLeaveDTO } from "application/dto/leave/trainer/request.leave.dto";
export const I_APPLY_LEAVE_REQUEST_TOKEN = Symbol("I_APPLY_LEAVE_REQUEST_TOKEN");

export interface IApplyLeaveRequest {
    execute(input: RequestLeaveDTO,trainerId:string): Promise<void>
}