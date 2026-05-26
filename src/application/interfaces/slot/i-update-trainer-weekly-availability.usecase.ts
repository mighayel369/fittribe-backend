import { WeeklyAvailabilityDTO } from "application/dto/schedules/update-slot-config";

export const I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN = Symbol("I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN");

export interface IUpdateTrainerWeeklyAvailabilityUseCase {
  execute(trainerId: string, availability: WeeklyAvailabilityDTO): Promise<void>;
}