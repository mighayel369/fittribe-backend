import { z } from "zod";
import { PaginationResponseSchema, PaginationResponseDTO } from "application/dto/common/PaginationDto";
import { GENDER } from "domain/constants/gender";

export const PendingTrainerResponseSchema =
    z.object({
        trainerId: z.string(),
        name: z.string(),
        pricePerSession: z.number(),
        programs: z.array(z.string()),
        gender: z.enum(GENDER)
    });

export type PendingTrainerResponseDTO =
    z.infer<typeof PendingTrainerResponseSchema>;

export const FetchAllPendingTrainersResponseSchema =
    PaginationResponseSchema(
        PendingTrainerResponseSchema
    );

export type FetchAllPendingTrainersResponseDTO = PaginationResponseDTO<PendingTrainerResponseDTO>;