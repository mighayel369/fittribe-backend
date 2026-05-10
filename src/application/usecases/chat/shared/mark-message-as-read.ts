import { inject, injectable } from "tsyringe";
import { IMarkMessageAsRead } from "application/interfaces/chat/i-mark-as-read";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class MarkMessageAsRead implements IMarkMessageAsRead {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo,

    @inject(I_MESSAGE_REPO_TOKEN)
    private readonly _messageRepository: IMessageRepo
  ) { }


  async execute(chatId: string, userId: string): Promise<void> {

    const chatRoom = await this._chatRepository.findById(chatId);

    if (!chatRoom) {
      throw new AppError(ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (chatRoom.unreadCount) {
      chatRoom.unreadCount.set(userId, 0);
      await this._chatRepository.updateChat(chatId, chatRoom);
    }

    await this._messageRepository.markAsRead(chatId, userId);
  }
}