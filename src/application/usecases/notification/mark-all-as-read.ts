import { inject, injectable } from "tsyringe";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";

@injectable()
export class MarkAllAsRead implements IMarkAsRead {
  constructor(
    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(recipientId: string): Promise<void> {

    await this._notificationRepository.markAllAsRead(recipientId);
  }
}