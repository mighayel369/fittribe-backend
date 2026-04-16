import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";

export const I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN = Symbol("I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN");

export interface IUpdateTrainerWeeklyAvailabilityUseCase {
  execute(input: UpdateTrainerAvailabilityRequestDTO): Promise<void>;
}