import { inject, injectable } from "tsyringe";
import { IGetChatId } from "application/interfaces/chat/i-get-chat-id";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";

@injectable()
export class GetChatId implements IGetChatId {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(senderId: string, receiverId: string): Promise<{ chatId: string } | null> {

    const existingChatId = await this._chatRepository.findChatRoom(senderId, receiverId);

    if (!existingChatId) {
      return null;
    }

    return {
      chatId: existingChatId.chatId
    }
  }
}