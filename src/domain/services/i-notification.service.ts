import { NotificationResponseDTO } from "application/dto/notification/notification.dto";

export const I_NOTIFICATION_SERVICE_TOKEN = Symbol("I_NOTIFICATION_SERVICE_TOKEN");

export interface INotificationService {
  notifyUser(recipientId: string,payload:NotificationResponseDTO): Promise<void>;
}