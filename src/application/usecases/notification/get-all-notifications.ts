import { NotificationResponseDTO } from "application/dto/notification/notification.dto";
import { IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { inject,injectable } from "tsyringe";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
@injectable()
export class GetAllNotification  implements IGetNotification{
    constructor(
         @inject(I_NOTIFICATION_REPO_TOKEN) private _notificationRepo: INotificationRepo
        ){}

   async execute(id: string): Promise<NotificationResponseDTO[]> {
    let notifications=await this._notificationRepo.getByUserId(id)

    return notifications.map(d=>NotificationMapper.toResponseDTO(d))
   }
}