import { MessageEntity } from "domain/entities/MessageEntity";
import { randomUUID } from "crypto";
import { ChatEntity } from "domain/entities/ChatEntity";
import { ChatMessageRequestDTO, ChatMessageResponseDTO } from "application/dto/chat/message-dto";
import { ChatListResponseDTO } from "application/dto/chat/chat-list.dto";

export const ChatMapper = {
    toChatEntity(data: ChatMessageRequestDTO): ChatEntity {
        return new ChatEntity(
            randomUUID(),
            [data.senderId, data.receiverId],

        )
    },

    toMessageEntity(data: ChatMessageRequestDTO): MessageEntity {
        return new MessageEntity(
            randomUUID(),
            data.chatId,
            data.senderId,
            data.content,
            data.type,
        )
    },

    toMessageReceiverDTO(entity: MessageEntity): ChatMessageResponseDTO {
        return {
            sender: entity.senderId,
            text: entity.content,
            date: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
            chatId: entity.chatId
        }
    },

    toTrainerChatListResponseDTO(data: any, trainerId: string): ChatListResponseDTO {
       
        return {
            chatId: data.chatId,
            name: data.clientInfo?.name || "Unknown Client",
            id:data.clientInfo?.userId,
            profilePic: data.clientInfo?.profilePic || "",
            lastMessage: data.lastMsg?.content || "No messages yet",
            lastMessageTime: data.lastMsg?.createdAt || data.updatedAt,
       
            unReadCount: data.unreadCount instanceof Map
                ? (data.unreadCount.get(trainerId) || 0)
                : (data.unreadCount?.[trainerId] || 0)
        };
    },

      toClientChatListResponseDTO(data: any, userId: string): ChatListResponseDTO {
        return {
            chatId: data.chatId,
            name: data.trainerInfo?.name,
            id:data.trainerInfo?.trainerId,
            profilePic: data.trainerInfo?.profilePic || "",
            lastMessage: data.lastMsg?.content || "No messages yet",
            lastMessageTime: data.lastMsg?.createdAt || data.updatedAt,
       
            unReadCount: data.unreadCount instanceof Map
                ? (data.unreadCount.get(userId) || 0)
                : (data.unreadCount?.[userId] || 0)
        };
    }
}