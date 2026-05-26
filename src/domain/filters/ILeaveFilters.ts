
import { z } from "zod";

import { LEAVE_STATUS, LEAVE_TYPES } from "domain/constants/leave-status";

export const LeaveFiltersSchema =
    z.object({
        search: z.string().trim().optional(),
        trainerId: z.string().trim().optional(),
        status: z.enum(LEAVE_STATUS).optional(),
        type: z.enum(LEAVE_TYPES).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
    });

export type ILeaveFilters =
    z.infer<typeof LeaveFiltersSchema>;