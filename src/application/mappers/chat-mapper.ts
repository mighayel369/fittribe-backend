import { MessageEntity } from "domain/entities/MessageEntity";
import { randomUUID } from "crypto";
import { ChatEntity } from "domain/entities/ChatEntity";
import { ChatMessageRequestDTO, ChatMessageResponseDTO } from "application/dto/chat/message-dto";
import { ChatListResponseDTO, NonEstablishedChatListResponseDTO } from "application/dto/chat/chat-list.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ClientChatListType, TrainerChatListType } from "domain/repositories/types/chat-type";
import { UserEntity } from "domain/entities/UserEntity";
export const ChatMapper = {
    toChatEntity(data: ChatMessageRequestDTO): ChatEntity {
        return new ChatEntity(
            randomUUID(),
            [data.senderId, data.receiverId],

        )
    },

    toMessageEntity(data: ChatMessageRequestDTO): MessageEntity {
        if (!data.chatId) {
            throw new AppError(ERROR_MESSAGES.CHATID_INVALID);
        }

        return new MessageEntity(
            randomUUID(),
            data.chatId,
            data.senderId,
            data.content,
            data.type,
            false,
            true,
            data.file ? {
                url: data.file.url,
                mimeType: data.file.mimeType,
                size: data.file.size,
                name: data.file.name
            } : undefined
        );
    },

    toMessageReceiverDTO(entity: MessageEntity): ChatMessageResponseDTO {
        return {
            sender: entity.senderId,
            content: entity.content,
            date: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
            chatId: entity.chatId,
            type: entity.type,
            file: entity.file ? {
                url: entity.file.url,
                mimeType: entity.file.mimeType,
                size: entity.file.size,
                name: entity.file.name
            } : undefined
        };
    },

    toTrainerChatListDTO(data: TrainerChatListType, trainerId: string): ChatListResponseDTO {
        return {
            id: data.user.userId,
            name: data.user.name,
            profilePic: data.user.profilePic || "",
            chatId: data.chat.chatId,
            unReadCount: data.chat.unreadCount instanceof Map
                ? (data.chat.unreadCount.get(trainerId) || 0)
                : (data.chat.unreadCount?.[trainerId] || 0),

            lastMessage: data.message?.content || "No messages yet",

            lastMessageTime: data.message?.createdAt
                ? new Date(data.message.createdAt).toISOString()
                : "No Time available"
        };
    },

    toClientChatListDTO(data: ClientChatListType, userId: string): ChatListResponseDTO {
        return {
            id: data.trainer.trainerId,
            name: data.trainer.name,
            profilePic: data.trainer.profilePic || "",
            chatId: data.chat.chatId,
            unReadCount: data.chat.unreadCount instanceof Map
                ? (data.chat.unreadCount.get(userId) || 0)
                : (data.chat.unreadCount?.[userId] || 0),
            lastMessage: data.message?.content || "No messages yet",
            lastMessageTime: data.message?.createdAt
                ? new Date(data.message.createdAt).toISOString()
                : "No Time available"
        };
    },


    toNonEstablishedChatDTO(user: UserEntity): NonEstablishedChatListResponseDTO {
        return {
            id: user.userId,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic || ""
        };
    }
}