
import { Server } from "socket.io";
import config from "config";

export class SocketService {
  private static _io: Server;
  private static onlineUsers = new Map<string, string>();

  static init(server: any): Server {
    this._io = new Server(server, {
      cors: { 
        origin: config.CLIENT_URL, 
        credentials: true 
      }
    });

    this._io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId && userId !== "undefined") {
        this.onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`User connected: ${userId} (Socket: ${socket.id})`);
      }

      socket.on("disconnect", () => {
        if (userId) {
          this.onlineUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
        }
      });
    });

    return this._io;
  }

  static get io(): Server {
    if (!this._io) {
      throw new Error("Socket.io not initialized!");
    }
    return this._io;
  }
}