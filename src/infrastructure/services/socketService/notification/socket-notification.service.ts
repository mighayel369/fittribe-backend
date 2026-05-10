
import { NotificationResponseDTO } from "application/dto/notification/notification.dto";
import { inject, singleton } from "tsyringe";
import { INotificationService } from "domain/services/i-notification.service";
import { I_SOCKET_SERVICE_TOKEN, ISocketService } from "domain/services/i-socket-service";

@singleton()
export class SocketNotificationService implements INotificationService {
  constructor(
    @inject(I_SOCKET_SERVICE_TOKEN) private _socketService: ISocketService
  ) { }

  async notifyUser(recipientId: string, payload: NotificationResponseDTO): Promise<void> {
    this._socketService.emitToRoom(recipientId, "notification_received", payload);
  }
}