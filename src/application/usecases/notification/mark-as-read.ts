import { inject, injectable } from "tsyringe";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class MarkAsRead implements IMarkAsRead {
  constructor(
    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }


  async execute(notificationId: string): Promise<void> {
    const notification = await this._notificationRepository.getByNotificationId(notificationId);

    if (!notification) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._notificationRepository.markAsRead(notificationId);
  }
}