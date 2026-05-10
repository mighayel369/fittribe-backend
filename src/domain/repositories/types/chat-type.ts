import { ChatEntity } from "domain/entities/ChatEntity";
import { MessageEntity } from "domain/entities/MessageEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { UserEntity } from "domain/entities/UserEntity";


export interface TrainerChatListType {
    chat: Omit<ChatEntity, "lastmessageId" | "participants">
    user: UserEntity
    message: MessageEntity
}

export interface ClientChatListType {
    chat: Omit<ChatEntity, "lastmessageId" | "participants">
    trainer: TrainerEntity
    message: MessageEntity
}