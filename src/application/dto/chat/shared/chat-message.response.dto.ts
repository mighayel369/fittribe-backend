import { z } from "zod";
import { MessageType } from "domain/constants/message-type";

export const ChatFileSchema = z.object({
    url: z.string(),
    mimeType: z.enum(MessageType),
    size: z.number(),
    name: z.string()
});

export const ChatMessageResponseSchema = z.object({
    messageId: z.string(),
    chatId: z.string(),
    senderId: z.string(),
    receiverId: z.string().nullable(),
    type: z.enum(MessageType),
    content: z.string().optional(),
    isRead: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.string(),
    file: ChatFileSchema.nullable().optional()
});


export const ChatMessagesResponseSchema = z.array(ChatMessageResponseSchema);

export type ChatMessageResponseDTO = z.infer<typeof ChatMessageResponseSchema>;