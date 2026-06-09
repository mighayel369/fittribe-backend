import { singleton, inject } from "tsyringe";
import { I_SOCKET_SERVICE_TOKEN, ISocketService } from "domain/services/i-socket-service";
import { EventEmitterService } from "domain/services/i-event-emitter";
@singleton()
export class SocketChatService {
  constructor(
    @inject(I_SOCKET_SERVICE_TOKEN) private _socketService: ISocketService,
    @inject(EventEmitterService) private _eventEmitter: EventEmitterService
  ) {
    this.initializeListeners();
  }


  private initializeListeners(): void {
    this._eventEmitter.on("MESSAGE_SENT", ({ senderId, receiverId, payload }) => {

      this._socketService.emitToRoom(receiverId, 'message_received', payload);
     
      this._socketService.emitToRoom(senderId, 'message_received', payload);

    });
  }
}