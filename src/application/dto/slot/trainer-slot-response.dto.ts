import { WeeklyAvailability } from "domain/entities/types/slot.types";

export interface TrainerSlotResponseDTO {
  trainerId: string;
  weeklyAvailability: WeeklyAvailability
}