import { NotificationEntity } from "domain/entities/NotificationEntity";


export interface INotificationRepo{
    addNotification(data:NotificationEntity):Promise<void>
    getByUserId(userId:string):Promise<NotificationEntity[]>
    getByNotificationId(id:string):Promise<NotificationEntity|null>
    markAsRead(id:string):Promise<void>
    markAllAsRead(recipientId:string):Promise<void>
}