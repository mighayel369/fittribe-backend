
import { z } from "zod";
import { PaginationResponseSchema } from "../common/PaginationDto";




export const ClientTrainerSchema =
    z.object({
        trainerId:
            z.string(),
        name:
            z.string(),
        email:
            z.email(),
        status:
            z.boolean(),
        pricePerSession:
            z.number(),
        profilePic:
            z.string()
                .nullable(),
        rating:
            z.number(),
        experience:
            z.number(),
        address:
            z.string()
                .nullable(),
        programs:
            z.array(
                z.string()
            )
    });

export type ClientTrainersResponseDTO = z.infer<typeof ClientTrainerSchema>;



export const FetchAllClientTrainersResponseSchema =
    PaginationResponseSchema(
        ClientTrainerSchema
    );

export type FetchAllClientTrainersResponseDTO =
    z.infer<typeof FetchAllClientTrainersResponseSchema>;