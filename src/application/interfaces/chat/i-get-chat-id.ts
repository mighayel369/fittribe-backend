import { GetChatIdResponseDTO } from "application/dto/chat/shared/get-chat-id.response.dto";
export const I_GET_CHAT_ID_TOKEN = Symbol("I_GET_CHAT_ID_TOKEN");

export interface IGetChatId {
    execute(senderId: string, receiverId: string): Promise<GetChatIdResponseDTO | null>
}