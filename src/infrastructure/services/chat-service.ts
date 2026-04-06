import { injectable } from "tsyringe";
import { SocketService } from "./SocketService";
import { IChatService } from "domain/services/i-chat-service";
import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";

@injectable()
export class SocketChatService implements IChatService {
  
 async sendMessage(recipientId: string, payload: ChatMessageResponseDTO): Promise<void> {
   let io=SocketService.io

   io.to(recipientId).emit('message_received',payload)
 }
}