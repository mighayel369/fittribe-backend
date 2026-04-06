import { MessageEntity } from "../entities/MessageEntity";

export interface IMessageRepo {
  saveMessage(message: MessageEntity): Promise<MessageEntity>;
  getChatHistory(chatId: string): Promise<MessageEntity[]>;
  markAsRead(chatId:string,receiverId:string):Promise<void>
}