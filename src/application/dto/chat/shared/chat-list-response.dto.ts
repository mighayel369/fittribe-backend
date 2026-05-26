import { z } from "zod";
import { ChatMessageResponseSchema } from "./chat-message.response.dto";

export const ChatListResponseSchema = z.object({
    name: z.string(),
    profilePic: z.string(),
    id: z.string(),
    lastMessage: ChatMessageResponseSchema,
    lastMessageTime: z.string(),
    unReadCount: z.number(),
    chatId: z.string()
});

export const ChatListArrayResponseSchema =
    z.array(ChatListResponseSchema);

export type ChatListResponseDTO =
    z.infer<typeof ChatListResponseSchema>;