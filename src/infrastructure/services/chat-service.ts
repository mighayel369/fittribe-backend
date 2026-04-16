import { singleton ,inject} from "tsyringe";
import { I_SOCKET_SERVICE_TOKEN, ISocketService } from "domain/services/i-socket-service";
import { IChatService } from "domain/services/i-chat-service";

@singleton()
export class SocketChatService implements IChatService {
  constructor(
    @inject(I_SOCKET_SERVICE_TOKEN) private _socketService: ISocketService
  ) {}

  async sendMessage(recipientId: string, payload: any): Promise<void> {
    this._socketService.emitToRoom(recipientId, 'message_received', payload);
  }
}