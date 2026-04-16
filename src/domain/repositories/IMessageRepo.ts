import { MessageEntity } from "../entities/MessageEntity";

export const I_MESSAGE_REPO_TOKEN = Symbol("I_MESSAGE_REPO_TOKEN");

export interface IMessageRepo {
  saveMessage(message: MessageEntity): Promise<MessageEntity>;
  getChatHistory(chatId: string): Promise<MessageEntity[]>;
  markAsRead(chatId:string,receiverId:string):Promise<void>
}