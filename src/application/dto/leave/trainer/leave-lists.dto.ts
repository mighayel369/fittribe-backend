import z from 'zod'
import { LEAVE_TYPES, LEAVE_STATUS } from 'domain/constants/leave-status';
import { PaginationResponseSchema,PaginationResponseDTO } from 'application/dto/common/PaginationDto';

export const TrainerLeaveResponseSchema =
    z.object({

        leaveId:
            z.string(),

        type:
            z.enum(LEAVE_TYPES),

        startDate:
            z.string(),

        endDate:
            z.string(),

        days:
            z.number(),

        reason:
            z.string(),

        status:
            z.enum(LEAVE_STATUS),

        submittedAt:
            z.string(),

        adminComment:
            z.string()
                .optional()
    });

export type TrainerLeaveResponse = z.infer<  typeof TrainerLeaveResponseSchema>;



export const FetchTrainerLeaveResponseSchema =
    PaginationResponseSchema(
        TrainerLeaveResponseSchema
    );

export type FetchTrainerLeaveResponseDTO =
    PaginationResponseDTO<
        TrainerLeaveResponse
    >;