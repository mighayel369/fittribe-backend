import { inject, injectable } from "tsyringe";
import { NotificationResponseDTO } from "application/dto/notification/notification.dto";
import { IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";

@injectable()
export class GetAllNotification implements IGetNotification {
  constructor(
    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(userId: string): Promise<NotificationResponseDTO[]> {


    const userNotifications = await this._notificationRepository.getByUserId(userId);

    return userNotifications.map(notification =>
      NotificationMapper.toResponseDTO(notification)
    );
  }
}