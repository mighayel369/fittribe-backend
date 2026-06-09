import { Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import { ISendMessage, I_SEND_MESSAGE_TOKEN } from "application/interfaces/chat/i-send-message";
import logger from "../../../../logger/index";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ChatMessageRequestSchema, ChatMessageRequestDTO } from "application/dto/chat/shared/chat-message.request.dto";

@injectable()
export class ChatHandler {
  private logger = logger;

  constructor(
    @inject(I_SEND_MESSAGE_TOKEN) private _sendMessageUseCase: ISendMessage
  ) { }

  public registerEvents(socket: Socket, userId: string): void {

    socket.on("join_chat_room", (chatId: string) => {
      socket.join(`chat_${chatId}`);
      this.logger.info(`👥 User ${userId} focused on chat: ${chatId}`);
    });

    socket.on("leave_chat_room", (chatId: string) => {
      socket.leave(`chat_${chatId}`);
      this.logger.info(`👥 User ${userId} unfocused chat: ${chatId}`);
    });

    socket.on("send_message", async (rawData: ChatMessageRequestDTO) => {
      try {
        const chatId = rawData.chatId;
        let isRead = false;

        if (chatId) {
          const roomName = `chat_${chatId}`;

          const ioServer = socket.nsp.server;

          const activeSocketsInRoom = ioServer.sockets.adapter.rooms.get(roomName);

          const receiverRoom = ioServer.sockets.adapter.rooms.get(rawData.receiverId);

          if (activeSocketsInRoom && receiverRoom) {
            const receiverSocketIds = Array.from(receiverRoom);
            isRead = receiverSocketIds.some(id => activeSocketsInRoom.has(id));
          }
        }


        const validatedData = ChatMessageRequestSchema.parse({
          ...rawData as object,
          senderId: userId,
          isRead
        });

        await this._sendMessageUseCase.execute(validatedData);
      } catch (error) {
        this.logger.error("Chat Socket Error:", error);
        socket.emit("error", { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
}