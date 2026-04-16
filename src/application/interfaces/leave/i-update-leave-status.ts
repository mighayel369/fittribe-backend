import { UpdateLeaveStatusRequestDTO } from "application/dto/leave/update-status.dto";

export const I_UPDATE_LEAVE_STATUS_TOKEN = Symbol("I_UPDATE_LEAVE_STATUS_TOKEN");

export interface IUpdateLeaveStatus{
    execute(input:UpdateLeaveStatusRequestDTO):Promise<void>
}