import { z } from 'zod';

const timeRangeSchema = z.object({
  start: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i, "Invalid start time format (h:mm AM/PM)"),
  end: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i, "Invalid end time format (h:mm AM/PM)"),
}).refine((data) => {

  
  const toMinutes = (time: string) => {
    const [h, mAndAffix] = time.split(':');
    const [m, affix] = mAndAffix.split(' ');
    let hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    if (affix.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (affix.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  return toMinutes(data.end) > toMinutes(data.start);
}, {
  message: "End time must be after start time",
  path: ["end"]
});

const weeklyAvailabilitySchema = z.object({
  monday: z.array(timeRangeSchema),
  tuesday: z.array(timeRangeSchema),
  wednesday: z.array(timeRangeSchema),
  thursday: z.array(timeRangeSchema),
  friday: z.array(timeRangeSchema),
  saturday: z.array(timeRangeSchema),
  sunday: z.array(timeRangeSchema),
});

export const syncWeeklyAvailabilitySchema = z.object({
  weeklyAvailability: weeklyAvailabilitySchema
});