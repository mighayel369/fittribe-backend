import { NotificationResponseDTO } from "application/dto/notification/notification.dto";

export const I_GET_ALL_NOTIFICATIONS_TOKEN = Symbol("I_GET_ALL_NOTIFICATIONS_TOKEN");
export interface IGetNotification {
    execute(ownerId: string): Promise<NotificationResponseDTO[]>
}