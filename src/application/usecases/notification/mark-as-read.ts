import { inject,injectable } from "tsyringe";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";
import { AppError } from "domain/errors/AppError";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
@injectable()
export class MarkAsRead implements IMarkAsRead {
  constructor(
    @inject("INotificationRepo") private _notificationRepo: INotificationRepo
  ) {}

  async execute(notificationId: string): Promise<void> {
    const notification = await this._notificationRepo.getByNotificationId(notificationId);
    if (!notification) throw new AppError("Notification not found", 404);

    await this._notificationRepo.markAsRead(notificationId);
  }
}