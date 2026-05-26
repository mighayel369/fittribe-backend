
import { z } from "zod";

export const ProgramsSchema = z.object({
    programId: z.string(),
    name: z.string(),
    description: z.string(),
    programPic: z.string()
});

export type ProgramsDTO = z.infer<typeof ProgramsSchema>;

export const ExploreProgramsResponseSchema =
    z.object({
        data: z.array(
            ProgramsSchema
        )
    });

export type ExploreProgramsResponseDTO = z.infer<typeof ExploreProgramsResponseSchema>;