import { ApplyLeaveRequestDTO } from "application/dto/leave/apply-leave.dto";

export interface IApplyLeaveRequest{
    execute(input:ApplyLeaveRequestDTO):Promise<void>
}