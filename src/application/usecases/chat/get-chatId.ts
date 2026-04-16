import { IGetChatId } from "application/interfaces/chat/i-get-chat-id";
import { inject, injectable } from "tsyringe";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
@injectable()
export class GetChatId implements IGetChatId {
    constructor(@inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo) { }

    async execute(senderId: string, receiverId: string): Promise<{ chatId: string } | null> {
        const chatId = await this._chatRepo.getChatId(senderId, receiverId);
        
        if (!chatId) {
            return null;
        }

        return { chatId };
    }
}