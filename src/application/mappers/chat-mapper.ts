import { MessageEntity } from "domain/entities/MessageEntity";
import { randomUUID } from "crypto";
import { ChatEntity } from "domain/entities/ChatEntity";
import { ChatMessageResponseDTO } from "application/dto/chat/shared/chat-message.response.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ClientChatListType, TrainerChatListAggregate } from "domain/repositories/types/chat-type";
import { UserEntity } from "domain/entities/UserEntity";
import { ChatListResponseDTO } from "application/dto/chat/shared/chat-list-response.dto";
import { NonEstablishedChatListResponseDTO } from "application/dto/chat/trainer/client-list.dto";
import { ChatMessageRequestDTO } from "application/dto/chat/shared/chat-message.request.dto";
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
            data.type,
            data.isRead,
            true,
            data.content,
            data.file ? {
                url: data.file.url,
                mimeType: data.file.mimeType,
                size: data.file.size,
                name: data.file.name
            } : undefined
        );
    },


    toMessageReceiverDTO(entity: MessageEntity, receiverId: string | null): ChatMessageResponseDTO {
        return {
            messageId: entity.messageId,
            chatId: entity.chatId,
            senderId: entity.senderId,
            receiverId: receiverId,
            type: entity.type,
            content: entity.content || "",
            isRead: entity.isRead,
            isActive: entity.isActive,
            createdAt: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
            file: entity.file?.url
                ? {
                    url: entity.file.url,
                    mimeType: entity.file.mimeType,
                    size: entity.file.size,
                    name: entity.file.name
                }
                : undefined
        };
    },

    toTrainerChatListDTO(data: TrainerChatListAggregate, trainerId: string): ChatListResponseDTO {
        return {
            id: data.user.userId,
            name: data.user.name,
            profilePic: data.user.profilePic || "",
            chatId: data.chatId,
            unReadCount: data.unreadCount instanceof Map
                ? (data.unreadCount.get(trainerId) || 0)
                : (data.unreadCount?.[trainerId] || 0),

            lastMessage: this.toMessageReceiverDTO(data.message, data.user.userId),

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
            lastMessage: this.toMessageReceiverDTO(data.message, data.trainer.trainerId),
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