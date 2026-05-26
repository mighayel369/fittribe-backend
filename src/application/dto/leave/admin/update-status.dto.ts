
import { z } from "zod";
import { LEAVE_STATUS } from "domain/constants/leave-status";


export const UpdateLeaveStatusRequestSchema =
    z.object({
        leaveId: z.string().trim().min(1, "Leave id is required"),
        status: z.enum(LEAVE_STATUS),
        adminComment: z.string().trim().max(500).optional()
    });

export type UpdateLeaveStatusRequestDTO = z.infer<typeof UpdateLeaveStatusRequestSchema>;