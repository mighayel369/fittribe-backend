
import { z } from "zod";
import { LEAVE_TYPES } from "domain/constants/leave-status";


export const RequestLeaveSchema =
    z.object({
        type: z.enum(LEAVE_TYPES),
        startDate: z.string(),
        endDate: z.string(),
        reason: z.string().trim().min(5, "Reason is required").max(500),
    }).refine(
        data =>
            new Date(data.startDate)
            <= new Date(data.endDate),
        {
            message:
                "End date must be after start date",
            path: ["endDate"]
        }
    );

export type RequestLeaveBodyDTO =
    z.infer<typeof RequestLeaveSchema>;

export interface RequestLeaveDTO
    extends RequestLeaveBodyDTO {

    documents?: Express.Multer.File;
}