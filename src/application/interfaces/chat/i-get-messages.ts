import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";

export interface IgetMessages{
    execute(chatId:string):Promise<ChatMessageResponseDTO[]>
}