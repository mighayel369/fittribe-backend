import { ChatMessageRequestDTO } from "application/dto/chat/shared/chat-message.request.dto";

export const I_SEND_MESSAGE_TOKEN = Symbol("I_SEND_MESSAGE_TOKEN");

export interface ISendMessage {
    execute(input: ChatMessageRequestDTO): Promise<void>;
}