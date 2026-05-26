import { z } from "zod";
import { ACTIONS } from "utils/Constants";



export const TrainerApprovalSchema =
    z.object({
        trainerId: z.string().trim().min(1, "Trainer id is required"),
        action: z.enum(ACTIONS),
        reason: z.string().trim().max(
            500,
            "Reason is too long"
        ).optional()
    });

export type TrainerApprovalRequestDTO = z.infer<typeof TrainerApprovalSchema>;