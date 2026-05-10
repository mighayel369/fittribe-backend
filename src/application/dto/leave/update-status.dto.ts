import {LEAVE_STATUS } from "domain/constants/leave-status"


export interface UpdateLeaveStatusRequestDTO {
    leaveId: string
    status: LEAVE_STATUS
    adminComment?: string
}