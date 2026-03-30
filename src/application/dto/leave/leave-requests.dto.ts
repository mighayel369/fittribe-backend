import { LEAVE_STATUS, LEAVE_TYPES } from "utils/Constants";
import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";


export interface LeaveRequestBase {
    leaveId: string; 
    type: LEAVE_TYPES;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: LEAVE_STATUS;
    submittedAt: string;
}


export interface TrainerLeaveRequest extends LeaveRequestBase {
    adminComment?: string;
}

export interface AdminLeaveRequest extends LeaveRequestBase {
    trainerId: string;
    trainerName: string;
    trainerProfilePic: string;
}


export interface FetchLeaveRequestsInputDTO extends PaginationInputDTO {
    status?: LEAVE_STATUS; 
    trainerId?: string;    
}

export interface FetchTrainerLeaveResponseDTO extends PaginationOutputDTO<TrainerLeaveRequest> {}

export interface FetchAdminLeaveResponseDTO extends PaginationOutputDTO<AdminLeaveRequest> {}