import { inject, injectable } from "tsyringe";
import { IGetChatId } from "application/interfaces/chat/i-get-chat-id";
import { GetChatIdResponseDTO, GetChatIdResponseSchema } from "application/dto/chat/shared/get-chat-id.response.dto";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class GetChatId implements IGetChatId {
  constructor(

    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(
    senderId: string,
    receiverId: string

  ): Promise<GetChatIdResponseDTO | null> {

    if (!senderId || !receiverId) {
      throw new AppError( ERROR_MESSAGES.MISSING_REQUIRED_DATA,HttpStatus.BAD_REQUEST);
    }

    const existingChatRoom =
      await this._chatRepository.findChatRoom(
        senderId,
        receiverId
      );

    if (!existingChatRoom) {
      return null;
    }

    return GetChatIdResponseSchema.parse({
      chatId: existingChatRoom.chatId
    });
  }
}