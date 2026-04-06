
import { Server } from "socket.io";
import { inject, injectable } from "tsyringe";
import { ISendMessage } from "application/interfaces/chat/i-send-message";
import config from "config";

@injectable()
export class SocketService {
  private static _io: Server;
  private static onlineUsers = new Map<string, string>();

  constructor(
    @inject("ISendMessage") private _sendMessageUseCase: ISendMessage
  ) {}

  public init(server: any): void {
    SocketService._io = new Server(server, {
      cors: { 
        origin: config.CLIENT_URL, 
        credentials: true 
      }
    });

    SocketService._io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId && userId !== "undefined") {
        SocketService.onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`User connected: ${userId}`);
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
          SocketService.onlineUsers.delete(userId);
        }
      });
    });
  }

  public static get io(): Server {
    if (!this._io) throw new Error("Socket.io not initialized!");
    return this._io;
  }
}