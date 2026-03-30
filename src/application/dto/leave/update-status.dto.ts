import { LEAVE_STATUS } from "utils/Constants"


export interface UpdateLeaveStatusRequestDTO{
    leaveId:string
    status:LEAVE_STATUS
    adminComment?:string
}