import {  IMarkMessageAsRead } from "application/interfaces/chat/i-mark-as-read";
import { inject, injectable } from "tsyringe";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class MarkMessageAsRead implements  IMarkMessageAsRead {
  constructor(
    @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo,
    @inject(I_MESSAGE_REPO_TOKEN) private _messageRepo: IMessageRepo
  ) {}

  async execute(chatId: string, receiverId: string): Promise<void> {
    const chatEntity = await this._chatRepo.findById(chatId);
    
    if (!chatEntity) {
      throw new AppError("Cannot find chat", HttpStatus.NOT_FOUND);
    }

    if (chatEntity.unreadCount) {
      chatEntity.unreadCount.set(receiverId, 0);
      await this._chatRepo.updateChat(chatId, chatEntity);
    }

    await this._messageRepo.markAsRead(chatId, receiverId);
  }
}