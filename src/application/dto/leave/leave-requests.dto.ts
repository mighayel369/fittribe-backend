import { LEAVE_STATUS, LEAVE_TYPES } from "utils/Constants";
import { PaginationInputDTO,PaginationOutputDTO } from "../common/PaginationDto";

export interface TrainerLeaveRequests{
    LeaveType:LEAVE_TYPES,
    DatesRequested:string,
    Reason:string,
    SubmittedOn:string,
    Status:LEAVE_STATUS
}

export interface AdminLeaveRequests extends TrainerLeaveRequests{
    trainerName:string,
    trainerProfilePic:string,
    TrainerServices:string[]
}

export interface FetchAllLeaveRequestsDTO extends PaginationInputDTO{}

export interface FetchAllTrainerLeaveRequestsResponseDTO extends PaginationOutputDTO<TrainerLeaveRequests>{}

export interface FetchAllLeaveRequestsResponseDTO extends PaginationOutputDTO<AdminLeaveRequests>{}
