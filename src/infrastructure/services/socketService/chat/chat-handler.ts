import { Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import { ISendMessage, I_SEND_MESSAGE_TOKEN } from "application/interfaces/chat/i-send-message";
import logger from "utils/logger";
import { z } from "zod";
import { ChatMessageRequestDTO } from "application/dto/chat/message-dto";
import { MessageType } from "domain/constants/message-type";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

const SendMessageSchema = z.object({
  chatId: z.string().optional(),
  receiverId: z.string().min(1),
  content: z.string().default(""),
  type: z.enum(MessageType).default(MessageType.TEXT),
  file: z.object({
    url: z.url(),
    mimeType: z.enum(MessageType).default(MessageType.TEXT),
    size: z.number(),
    name: z.string()
  }).optional()
});

type SendMessageSocketData = z.infer<typeof SendMessageSchema>;

@injectable()
export class ChatHandler {
  constructor(
    @inject(I_SEND_MESSAGE_TOKEN) private _sendMessageUseCase: ISendMessage
  ) { }

  public registerEvents(socket: Socket, userId: string): void {

    socket.on("send_message", async (rawData: unknown) => {
      try {

        const validatedData: SendMessageSocketData = SendMessageSchema.parse(rawData);

        const messageRequest: ChatMessageRequestDTO = {
          senderId: userId,
          receiverId: validatedData.receiverId,
          content: validatedData.content,
          type: validatedData.type,
          chatId: validatedData.chatId,
          file: validatedData.file
        };

        await this._sendMessageUseCase.execute(messageRequest);
      } catch (error) {
        logger.error("Chat Socket Error:", error);
        socket.emit("error", { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
}