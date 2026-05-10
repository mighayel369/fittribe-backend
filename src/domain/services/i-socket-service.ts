export const I_SOCKET_SERVICE_TOKEN = Symbol("I_SOCKET_SERVICE_TOKEN");
import { Server as HttpServer } from "http";
export interface ISocketService {
  init(server: HttpServer): void;
  emitToRoom(room: string, event: string, payload: unknown): void;
  isUserOnline(userId: string): boolean;
}