import { NotificationResponseDTO } from "application/dto/notification/notification.dro";


export interface IGetNotification{
    execute(id:string):Promise<NotificationResponseDTO[]>
}