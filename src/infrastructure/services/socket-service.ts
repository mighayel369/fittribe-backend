import { Server, Socket } from "socket.io";
import { delay, inject, injectable, singleton } from "tsyringe";
import { I_SEND_MESSAGE_TOKEN, ISendMessage } from "application/interfaces/chat/i-send-message";
import { ISocketService } from "domain/services/i-socket-service";
import config from "config";


@singleton()
export class SocketService implements ISocketService {
  private _io: Server | null = null;
  private onlineUsers = new Map<string, string>();

  constructor(
    @inject(delay(() => I_SEND_MESSAGE_TOKEN as any)) private _sendMessageUseCase: ISendMessage) { }
  public init(server: any): void {
    this._io = new Server(server, {
      cors: {
        origin: config.CLIENT_URL,
        credentials: true
      }
    });

    this._io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;

      if (userId && userId !== "undefined") {
        this.onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`⚡ User connected: ${userId} (Socket ID: ${socket.id})`);
      }

      socket.on("send_message", async (data) => {
        try {
          await this._sendMessageUseCase.execute(data);
        } catch (error) {
          socket.emit("error", { message: "Message delivery failed" });
        }
      });

      socket.on("disconnect", () => {
        if (userId) {
          this.onlineUsers.delete(userId);
          console.log(`🔌 User disconnected: ${userId}`);
        }
      });
    });
  }

  public emitToRoom(room: string, event: string, payload: any): void {
    if (!this._io) {
      console.warn("Attempted to emit before Socket.io initialization.");
      return;
    }
    this._io.to(room).emit(event, payload);
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}