
import { z } from "zod";
import {  PaginationResponseDTO,  PaginationResponseSchema } from "application/dto/common/PaginationDto";


export const TrainersResponseSchema =
  z.object({
    trainerId: z.string(),
    name: z.string(),
    email: z.email(),
    status: z.boolean(),
    pricePerSession: z.number()
  });

export type TrainersResponseDTO = z.infer<typeof TrainersResponseSchema>;

export const FetchAllTrainersResponseSchema =
  PaginationResponseSchema(
    TrainersResponseSchema
  );

export type FetchAllTrainersResponseDTO = PaginationResponseDTO<TrainersResponseDTO>;