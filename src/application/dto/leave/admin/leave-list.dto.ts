import z from 'zod'
import { LEAVE_STATUS, LEAVE_TYPES } from 'domain/constants/leave-status';
import { PaginationResponseDTO, PaginationResponseSchema } from 'application/dto/common/PaginationDto';
export const AdminLeaveResponseSchema =
    z.object({
        leaveId:
            z.string(),

        type:
            z.enum(
                Object.values(LEAVE_TYPES) as [
                    string,
                    ...string[]
                ]
            ),

        startDate:
            z.string(),

        endDate:
            z.string(),

        days:
            z.number(),

        reason:
            z.string(),

        status:
            z.enum(
                Object.values(LEAVE_STATUS) as [
                    string,
                    ...string[]
                ]
            ),

        submittedAt:
            z.string(),

        adminComment:
            z.string()
                .optional(),

        trainerId:
            z.string(),

        trainerName:
            z.string(),

        trainerProfilePic:
            z.string()
    });

export type AdminLeaveResponseDTO =
    z.infer<typeof AdminLeaveResponseSchema>;

export const FetchAdminLeaveResponseSchema =
    PaginationResponseSchema(
        AdminLeaveResponseSchema
    );

export type FetchAdminLeaveResponseDTO =
    PaginationResponseDTO<AdminLeaveResponseDTO>;