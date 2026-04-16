export const I_SOCKET_SERVICE_TOKEN = Symbol("I_SOCKET_SERVICE_TOKEN");

export interface ISocketService {
  init(server: any): void;
  emitToRoom(room: string, event: string, payload: any): void;
  isUserOnline(userId: string): boolean;
}