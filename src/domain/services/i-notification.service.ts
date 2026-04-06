import { NotificationResponseDTO } from "application/dto/notification/notification.dto";

export interface INotificationService {
  notifyUser(recipientId: string,payload:NotificationResponseDTO): Promise<void>;
}