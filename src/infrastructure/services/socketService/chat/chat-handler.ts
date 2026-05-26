import { Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import { ISendMessage, I_SEND_MESSAGE_TOKEN } from "application/interfaces/chat/i-send-message";
import logger from "../../../../logger/index";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ChatMessageRequestSchema } from "application/dto/chat/shared/chat-message.request.dto";

@injectable()
export class ChatHandler {
  private logger = logger;
  constructor(
    @inject(I_SEND_MESSAGE_TOKEN) private _sendMessageUseCase: ISendMessage
  ) { }

  public registerEvents(socket: Socket, userId: string): void {

    socket.on("send_message", async (rawData: unknown) => {
      try {
        const validatedData = ChatMessageRequestSchema.parse({
          ...rawData as object,
          senderId: userId
        });


        await this._sendMessageUseCase.execute(validatedData);
      } catch (error) {
        this.logger.error("Chat Socket Error:", error);
        socket.emit("error", { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
}