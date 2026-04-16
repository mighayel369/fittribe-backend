import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";

export const I_GET_MESSAGES_TOKEN = Symbol("I_GET_MESSAGES_TOKEN");

export interface IgetMessages{
    execute(chatId:string):Promise<ChatMessageResponseDTO[]>
}