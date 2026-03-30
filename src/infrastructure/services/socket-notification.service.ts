import { injectable } from "tsyringe";
import { SocketService } from "./SocketService";
import { INotificationService } from "domain/services/i-notification.service";
import { NotificationResponseDTO } from "application/dto/notification/notification.dro";
@injectable()
export class SocketNotificationService implements INotificationService {
  
  async notifyUser(recipientId: string, payload: NotificationResponseDTO): Promise<void> {
    try {
      const io = SocketService.io;
      
      // Sending the DTO which now includes the 'time' string
      io.to(recipientId).emit("notification_received", payload);
      
    } catch (error) {
      console.error("❌ Socket Error:", error);
    }
  }
}