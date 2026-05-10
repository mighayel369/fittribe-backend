import { LEAVE_TYPES,LEAVE_STATUS } from "domain/constants/leave-status";
import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";
import { ILeaveFilters } from "domain/filters/ILeaveFilters";

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


export interface FetchLeaveRequestsInputDTO extends PaginationInputDTO<ILeaveFilters> {
    trainerId?: string;
}

export type FetchTrainerLeaveResponseDTO = PaginationOutputDTO<TrainerLeaveRequest>

export type FetchAdminLeaveResponseDTO = PaginationOutputDTO<AdminLeaveRequest>