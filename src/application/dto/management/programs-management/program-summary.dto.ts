
import { z } from "zod";
import { PaginationResponseDTO, PaginationResponseSchema } from "application/dto/common/PaginationDto";



export const ProgramSummarySchema =
  z.object({
    programId: z.string(),
    name: z.string(),
    description: z.string(),
    programPic: z.string(),
    isPublished: z.boolean()
  });

export type ProgramSummaryDTO = z.infer<typeof ProgramSummarySchema>;


export const FetchProgramInventoryResponseSchema =
  PaginationResponseSchema(
    ProgramSummarySchema
  );

export type FetchProgramInventoryResponseDTO =
  PaginationResponseDTO<ProgramSummaryDTO>;