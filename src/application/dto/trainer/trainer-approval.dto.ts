import { ACTIONS } from "utils/Constants";

export interface TrainerApprovalRequestDTO {
    trainerId: string;
    action: ACTIONS;
    reason?: string;
}

