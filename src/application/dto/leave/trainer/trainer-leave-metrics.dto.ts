
import { z } from "zod";


export const TrainerLeaveMetricsSchema =
    z.object({
        label: z.string(),
        usedCount: z.number().min(0),
        totalCount: z.number().min(0)
    });

export type TrainerLeaveMetrics = z.infer<typeof TrainerLeaveMetricsSchema>;

export const TrainerLeaveMetricsListSchema = z.array(TrainerLeaveMetricsSchema);

export type TrainerLeaveMetricsListDTO = z.infer<typeof TrainerLeaveMetricsListSchema>;