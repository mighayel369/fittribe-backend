import { z } from "zod";

export const ChatIdParamsSchema =
    z.object({
        chatId: z
            .string()
            .trim()
            .min(1, "Receiver id is required")
    });

export type ChatIdParamsDTO = z.infer<typeof ChatIdParamsSchema>;