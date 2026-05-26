import { z } from "zod";

export const GetChatIdResponseSchema =
    z.object({
        chatId: z.string()
    });

export type GetChatIdResponseDTO = z.infer<typeof GetChatIdResponseSchema>;