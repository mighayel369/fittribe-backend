
import { z } from "zod";

import { LANGUAGE }
    from "domain/constants/language-type";

export const ProgramInfoSchema = z.object({
    programId: z.string(),
    name: z.string()
})

export const UserTrainerViewSchema =
    z.object({
        trainerId: z.string(),
        name: z.string(),
        profilePic: z.string(),
        pricePerSession: z.number(),
        experience: z.number(),
        languages: z.array(z.enum(LANGUAGE)),
        address: z.string(),
        bio: z.string(),
        rating: z.number(),
        chatId: z.string().nullable(),
        programs: z.array(ProgramInfoSchema)
    });

export type UserTrainerViewDTO = z.infer<typeof UserTrainerViewSchema>;