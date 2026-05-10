import { LEAVE_STATUS, LEAVE_TYPES } from "domain/constants/leave-status";


export interface LeaveExportDataResponseDTO {
    trainerName: string,
    type: LEAVE_TYPES;
    startDate: string;
    days: number;
    status: LEAVE_STATUS;
}