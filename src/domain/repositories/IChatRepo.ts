import { ChatEntity } from "domain/entities/ChatEntity";

export const I_CHAT_REPO_TOKEN = Symbol("I_CHAT_REPO_TOKEN");

export interface IChatRepo {
    establishChat(data: ChatEntity): Promise<ChatEntity>
    getChatListForTrainer(trainerId: string, searchQuery?: string): Promise<any[]>;
    getChatListForUser(userId: string, searchQuery?: string): Promise<any[]>;
    getChatId(senderId: string, receiverId: string): Promise<string | null>
    updateChat(chatId: string, data: ChatEntity): Promise<void>;
    findById(chatId: string): Promise<ChatEntity | null>
}