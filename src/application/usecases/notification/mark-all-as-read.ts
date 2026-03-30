import { inject,injectable } from "tsyringe";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";
import { AppError } from "domain/errors/AppError";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
@injectable()
export class MarkAllAsRead implements IMarkAsRead {
  constructor(
    @inject("INotificationRepo") private _notificationRepo: INotificationRepo
  ) {}

  async execute(recipientId: string): Promise<void> {

    await this._notificationRepo.markAllAsRead(recipientId);
  }
}