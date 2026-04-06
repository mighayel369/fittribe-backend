import { ChatEntity } from "domain/entities/ChatEntity";


export interface IChatRepo{
    establishChat(data:ChatEntity):Promise<ChatEntity>
    getChatListForTrainer(trainerId: string): Promise<any[]>;
    getChatListForUser(userId: string): Promise<any[]>;
    getChatId(senderId:string,receiverId:string):Promise<string|null>
    updateChat(chatId:string,data:ChatEntity): Promise<void>;
    findById(chatId:string):Promise<ChatEntity|null>
}