import { IGetChatId } from "application/interfaces/chat/i-get-chat-id";
import { inject, injectable } from "tsyringe";
import { IChatRepo } from "domain/repositories/IChatRepo";
@injectable()
export class GetChatId implements IGetChatId {
    constructor(@inject("IChatRepo") private _chatRepo: IChatRepo) { }

    async execute(senderId: string, receiverId: string): Promise<{ chatId: string } | null> {
        const chatId = await this._chatRepo.getChatId(senderId, receiverId);
        
        if (!chatId) {
            return null;
        }

        return { chatId };
    }
}