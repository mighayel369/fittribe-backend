import { TrainerWeeklyAvailabilityResponseDTO } from "application/dto/schedules/get-trainer-weekly-availability.dto";

export const I_GET_TRAINER_WEEKLY_AVAILABILITY_TOKEN = Symbol("I_GET_TRAINER_WEEKLY_AVAILABILITY_TOKEN");

export interface IGetTrainerWeeklyAvailabilityUseCase {
  execute(trainerId: string): Promise<TrainerWeeklyAvailabilityResponseDTO>;
}