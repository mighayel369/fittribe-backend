import { inject,injectable } from "tsyringe";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { AppError } from "domain/errors/AppError";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
@injectable()
export class MarkAllAsRead implements IMarkAsRead {
  constructor(
    @inject(I_NOTIFICATION_REPO_TOKEN) private _notificationRepo: INotificationRepo
  ) {}

  async execute(recipientId: string): Promise<void> {

    await this._notificationRepo.markAllAsRead(recipientId);
  }
}