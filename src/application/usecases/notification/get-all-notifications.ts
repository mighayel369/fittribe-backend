import { inject, injectable } from "tsyringe";
import { NotificationResponseDTO, NotificationResponseSchema } from "application/dto/notification/notification.dto";
import { IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class GetAllNotification implements IGetNotification {

  constructor(
    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(userId: string): Promise<NotificationResponseDTO[]> {

    if (!userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userNotifications = await this._notificationRepository.getByUserId(userId);

    return userNotifications.map((notification) =>
      NotificationResponseSchema.parse(
        NotificationMapper.toResponseDTO(
          notification
        )
      )
    );
  }
}