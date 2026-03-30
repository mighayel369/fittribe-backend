import { RequestLeaveDTO } from "application/dto/leave/request.leave.dto";

export interface IApplyLeaveRequest{
    execute(input:RequestLeaveDTO):Promise<void>
}