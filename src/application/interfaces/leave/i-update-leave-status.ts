import { UpdateLeaveStatusRequestDTO } from "application/dto/leave/update-status.dto";


export interface IUpdateLeaveStatus{
    execute(input:UpdateLeaveStatusRequestDTO):Promise<void>
}