import { z } from "zod";

export const TimeRangeResponseSchema =
  z.object({
    start: z.number(),
    end: z.number()
  });

export const DayAvailabilityResponseSchema =
  z.object({
    enabled: z.boolean(),
    slots: z.array(TimeRangeResponseSchema)
  });

export const WeeklyAvailabilityResponseSchema =
  z.object({
    monday: DayAvailabilityResponseSchema,
    tuesday: DayAvailabilityResponseSchema,
    wednesday: DayAvailabilityResponseSchema,
    thursday: DayAvailabilityResponseSchema,
    friday: DayAvailabilityResponseSchema,
    saturday: DayAvailabilityResponseSchema,
    sunday: DayAvailabilityResponseSchema
  });

export const TrainerWeeklyAvailabilityResponseSchema =
  z.object({
    trainerId: z.string(),
    weeklyAvailability: WeeklyAvailabilityResponseSchema
  });

export type TrainerWeeklyAvailabilityResponseDTO = z.infer<typeof TrainerWeeklyAvailabilityResponseSchema>;