import { RescheduleRequestDTO } from "application/dto/booking/reschedule-request.dto";

export const I_REQUEST_BOOKING_RESCHEDULE_TOKEN = Symbol("I_REQUEST_BOOKING_RESCHEDULE_TOKEN");
export const I_TRAINER_RESCHEDULE_BOOKING_TOKEN = Symbol("I_TRAINER_RESCHEDULE_BOOKING_TOKEN");

export interface IRequestBookingRescheduleUseCase {
  execute(data: RescheduleRequestDTO): Promise<void>;
}