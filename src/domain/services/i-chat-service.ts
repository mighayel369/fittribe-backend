import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";


export interface IChatService {
  sendMessage(recipientId: string,payload:ChatMessageResponseDTO): Promise<void>;
}