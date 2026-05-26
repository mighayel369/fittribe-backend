import { z } from "zod";
import { MessageType } from "domain/constants/message-type";

export const ChatFileSchema = z.object({
    url: z.string(),
    mimeType: z.enum(MessageType),
    size: z.number(),
    name: z.string()
});

export const ChatMessageResponseSchema = z.object({
    sender: z.string(),
    date: z.string(),
    chatId: z.string(),
    type: z.enum(MessageType),
    content: z.string().optional(),
    file: ChatFileSchema.nullable().optional()
});

export const ChatMessagesResponseSchema =
    z.array(ChatMessageResponseSchema);

export type ChatMessageResponseDTO =
    z.infer<typeof ChatMessageResponseSchema>;