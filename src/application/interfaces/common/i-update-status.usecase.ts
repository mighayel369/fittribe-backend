import { UpdateStatusRequestDTO,UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";
export const I_UPDATE_STATUS_TOKEN = Symbol("I_UPDATE_STATUS_TOKEN") 
export const I_UPDATE_USER_STATUS_TOKEN = Symbol("I_UPDATE_USER_STATUS_TOKEN");
export interface IUpdateStatus{
    execute(input:UpdateStatusRequestDTO):Promise<UpdateStatusResponseDTO>
}