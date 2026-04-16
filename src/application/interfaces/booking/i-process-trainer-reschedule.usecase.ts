import { ProcessRescheduleRequestDTO } from "../../dto/booking/process-reschedule.dto";

export const I_ACCEPT_RESCHEDULE_REQUEST_TOKEN = Symbol("I_ACCEPT_RESCHEDULE_REQUEST_TOKEN");
export const I_DECLINE_RESCHEDULE_REQUEST_TOKEN = Symbol("I_DECLINE_RESCHEDULE_REQUEST_TOKEN");

export interface IProcessTrainerRescheduleUseCase {
  execute(data: ProcessRescheduleRequestDTO): Promise<void>;
}