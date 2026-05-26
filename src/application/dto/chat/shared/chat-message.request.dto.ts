import { z } from "zod";
import { MessageType } from "domain/constants/message-type";

export const ChatFileSchema = z.object({

    url: z.string(),
    mimeType: z.enum(MessageType),
    size: z.number(),
    name: z.string()
});

export type ChatFileDTO = z.infer<typeof ChatFileSchema>;


export const ChatMessageRequestSchema = z.object({

    senderId: z
        .string()
        .trim()
        .min(1, "Sender id is required"),

    receiverId: z
        .string()
        .trim()
        .min(1, "Receiver id is required"),

    chatId: z
        .string()
        .trim()
        .optional(),

    content: z
        .string()
        .default(""),
    type: z
        .enum(MessageType)
        .default(MessageType.TEXT),
    file: ChatFileSchema
        .optional()
});

export type ChatMessageRequestDTO =
    z.infer<typeof ChatMessageRequestSchema>;