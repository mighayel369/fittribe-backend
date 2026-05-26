
import { z } from "zod";


export const LeaveParamsSchema =
    z.object({
        leaveId: z.string().trim().min(
            1,
            "leaveId is required"
        )
    });

export type LeaveParams = z.infer<typeof LeaveParamsSchema>;