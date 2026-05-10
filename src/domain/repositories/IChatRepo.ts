import { ChatEntity } from "domain/entities/ChatEntity";
import { ClientChatListType, TrainerChatListType } from "./types/chat-type";

export const I_CHAT_REPO_TOKEN = Symbol("I_CHAT_REPO_TOKEN");

export interface IChatRepo {
    establishChat(data: ChatEntity): Promise<ChatEntity>
    getChatListForTrainer(trainerId: string, searchQuery?: string): Promise<TrainerChatListType[]>;
    getChatListForUser(userId: string, searchQuery?: string): Promise<ClientChatListType[]>;
    findChatRoom(senderId: string, receiverId: string): Promise<ChatEntity | null>
    updateChat(chatId: string, data: ChatEntity): Promise<void>;
    findById(chatId: string): Promise<ChatEntity | null>
}