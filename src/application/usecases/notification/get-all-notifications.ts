import { NotificationResponseDTO } from "application/dto/notification/notification.dro";
import { IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { inject,injectable } from "tsyringe";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
@injectable()
export class GetAllNotification  implements IGetNotification{
    constructor(
         @inject("INotificationRepo") private _notificationRepo: INotificationRepo
        ){}

   async execute(id: string): Promise<NotificationResponseDTO[]> {
    let notifications=await this._notificationRepo.getByUserId(id)

    return notifications.map(d=>NotificationMapper.toResponseDTO(d))
   }
}