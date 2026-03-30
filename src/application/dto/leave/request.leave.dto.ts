import { LEAVE_TYPES } from "utils/Constants";


export interface RequestLeaveDTO{
    type:LEAVE_TYPES,
    startDate:string,
    endDate:string,
    reason:string,
    documents?:Express.Multer.File,
    trainerId:string
}