import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { inject, singleton } from "tsyringe";
import { ISocketService } from "../../../domain/services/i-socket-service";
import { ChatHandler } from "./chat/chat-handler";
import logger from "../../../logger/index";
import config from "config";
import { VideoCallHandler } from "./video-call/video-call-handler";

@singleton()
export class SocketService implements ISocketService {
  private logger = logger;
  private _io: Server | null = null;
  private onlineUsers = new Map<string, string>();

  constructor(
    @inject(ChatHandler) private _chatHandler: ChatHandler,
    @inject(VideoCallHandler) private _videoHandler: VideoCallHandler
  ) { }

  public init(server: HttpServer): void {
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

        this._chatHandler.registerEvents(socket, userId);
        this._videoHandler.registerEvents(socket, userId);

        this.logger.info(`✅ Connection established for user: ${userId}`);
      }

      socket.on("disconnect", () => {
        if (userId) {
          this.onlineUsers.delete(userId);
          this.logger.info(`❌ User disconnected: ${userId}`);
        }
      });
    });
  }

  public emitToRoom(room: string, event: string, payload: unknown): void {
    if (!this._io) {
      this.logger.warn("Attempted to emit before Socket.io initialization.");
      return;
    }
    this._io.to(room).emit(event, payload);
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}