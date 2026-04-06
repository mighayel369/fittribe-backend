import { ChatMessageRequestDTO } from "application/dto/chat/message-dto";

export interface ISendMessage{
    execute(input:ChatMessageRequestDTO):Promise<void>
}