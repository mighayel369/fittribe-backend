
import { z } from "zod";
import { SCHEDULE_STATUS } from "utils/Constants";


export const TrainerAvailabilityQuerySchema =
    z.object({
        trainerId: z.string().trim().min(1),
        date: z.string()
    });

export type TrainerAvailabilityQueryDTO =
    z.infer<typeof TrainerAvailabilityQuerySchema>;

export const FetchAvailableSlotResponseSchema =
    z.object({
        status:
            z.enum(SCHEDULE_STATUS),
        slots:
            z.array(
                z.number()
            ),
        message: z.string().optional()
    });

export type FetchAvailableSlotResponseDTO = z.infer<typeof FetchAvailableSlotResponseSchema>;