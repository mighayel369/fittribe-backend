import { SlotEntity } from "domain/entities/SlotEntity";

import { TrainerWeeklyAvailabilityResponseDTO, TrainerWeeklyAvailabilityResponseSchema } from "application/dto/schedules/get-trainer-weekly-availability.dto";

export class SlotMapper {
  static toWeeklyAvailabilityResponseDTO(entity: SlotEntity): TrainerWeeklyAvailabilityResponseDTO {
    return TrainerWeeklyAvailabilityResponseSchema.parse({
      trainerId: entity.trainerId,
      weeklyAvailability: {
        monday: {
          enabled: entity.weeklyAvailability.monday.enabled,
          slots: entity.weeklyAvailability.monday.slots
        },
        tuesday: {
          enabled: entity.weeklyAvailability.tuesday.enabled,
          slots: entity.weeklyAvailability.tuesday.slots
        },
        wednesday: {
          enabled: entity.weeklyAvailability.wednesday.enabled,
          slots: entity.weeklyAvailability.wednesday.slots
        },
        thursday: {
          enabled: entity.weeklyAvailability.thursday.enabled,
          slots: entity.weeklyAvailability.thursday.slots
        },
        friday: {
          enabled: entity.weeklyAvailability.friday.enabled,
          slots: entity.weeklyAvailability.friday.slots
        },
        saturday: {
          enabled: entity.weeklyAvailability.saturday.enabled,
          slots: entity.weeklyAvailability.saturday.slots
        },
        sunday: {
          enabled: entity.weeklyAvailability.sunday.enabled,
          slots: entity.weeklyAvailability.sunday.slots
        }
      }
    });
  }
}