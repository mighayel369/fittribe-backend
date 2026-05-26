import { z } from "zod";

export const ChatQuerySchema = z.object({
    search: z.string().trim().default("")
});

export type ChatQueryDTO =
    z.infer<typeof ChatQuerySchema>;