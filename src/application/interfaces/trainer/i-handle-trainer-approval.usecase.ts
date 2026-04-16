import { TrainerApprovalRequestDTO, TrainerApprovalResponseDTO } from "application/dto/trainer/trainer-approval.dto";

export const I_HANDLE_TRAINER_APPROVAL_TOKEN = Symbol("I_HANDLE_TRAINER_APPROVAL_TOKEN");

export interface IHandleTrainerApproval{
    execute(input:TrainerApprovalRequestDTO):Promise<TrainerApprovalResponseDTO>
}