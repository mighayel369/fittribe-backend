import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";

export const I_CHAT_SERVICE_TOKEN = Symbol("I_CHAT_SERVICE_TOKEN");
export interface IChatService {
  sendMessage(recipientId: string,payload:ChatMessageResponseDTO): Promise<void>;
}