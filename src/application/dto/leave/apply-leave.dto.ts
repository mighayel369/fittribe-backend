import { LEAVE_TYPES } from "utils/Constants";


export interface ApplyLeaveRequestDTO{
    type:LEAVE_TYPES,
    startDate:string,
    endDate:string,
    reason:string,
    documents:File,
    trainerId:string
}