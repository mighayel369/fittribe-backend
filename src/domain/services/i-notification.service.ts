import { NotificationResponseDTO } from "application/dto/notification/notification.dro";

export interface INotificationService {
  notifyUser(recipientId: string,payload:NotificationResponseDTO): Promise<void>;
}