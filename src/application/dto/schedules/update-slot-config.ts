import { z } from "zod";

export const TimeRangeSchema =
  z.object({
    start: z.number().min(0).max(1440),
    end: z.number().min(0).max(1440)
  })
    .refine(
      (slot) =>
        slot.start < slot.end,
      {
        message: "Start time must be before end time"
      }
    );

export const DayAvailabilitySchema =
  z.object({
    enabled: z.boolean(),
    slots: z.array(TimeRangeSchema)
  });

export const WeeklyAvailabilitySchema =
  z.object({
    monday: DayAvailabilitySchema,
    tuesday: DayAvailabilitySchema,
    wednesday: DayAvailabilitySchema,
    thursday: DayAvailabilitySchema,
    friday: DayAvailabilitySchema,
    saturday: DayAvailabilitySchema,
    sunday: DayAvailabilitySchema
  });

export const SyncWeeklyAvailabilityRequestSchema = z.object({
  weeklyAvailability: WeeklyAvailabilitySchema
});

export type WeeklyAvailabilityDTO = z.infer<typeof WeeklyAvailabilitySchema>;

export type SyncWeeklyAvailabilityRequestDTO = z.infer<typeof SyncWeeklyAvailabilityRequestSchema>;