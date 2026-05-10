import { LEAVE_TYPES } from "domain/constants/leave-status"


export interface RequestLeaveDTO {
    type: LEAVE_TYPES,
    startDate: string,
    endDate: string,
    reason: string,
    documents?: Express.Multer.File,
    trainerId: string
}