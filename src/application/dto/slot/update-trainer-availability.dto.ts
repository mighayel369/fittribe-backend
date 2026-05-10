import { WeeklyAvailability } from "domain/entities/types/slot.types";

export interface UpdateTrainerAvailabilityRequestDTO {
  trainerId: string;
  availability: WeeklyAvailability;
}