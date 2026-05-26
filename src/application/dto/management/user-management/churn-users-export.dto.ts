import { z } from "zod";

export const ChurnUserSchema =
    z.object({
        name: z.string(),
        joinedOn: z.string(),
        phone: z.string(),
        email: z.email(),
        lastBookedDate: z.string()
    });

export type ChurnUserDto = z.infer<typeof ChurnUserSchema>;