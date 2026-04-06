import { NotificationResponseDTO } from "application/dto/notification/notification.dto";


export interface IGetNotification{
    execute(id:string):Promise<NotificationResponseDTO[]>
}