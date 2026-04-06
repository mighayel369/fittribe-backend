import { NonEstablishedChatListResponseDTO } from "application/dto/chat/chat-list.dto";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { IChatRepo } from "domain/repositories/IChatRepo";
import { IUserRepo } from "domain/repositories/IUserRepo";

@injectable()
export class FetchNonEstablishedTrainerChatList implements IFetchChatList<NonEstablishedChatListResponseDTO> {
    constructor(
        @inject("IChatRepo") private _chatRepo: IChatRepo,
        @inject("IUserRepo") private readonly _userRepo: IUserRepo
    ) { }

    async execute(id: string): Promise<NonEstablishedChatListResponseDTO[]> {
        const chatList = await this._chatRepo.getChatListForTrainer(id);

        const establishedIds = new Set(chatList.map(chat => chat.clientInfo.userId));

        const allClients = await this._userRepo.findActiveClients();

        return allClients
            .filter(client => !establishedIds.has(client.userId) && client.userId !== id)
            .map(client => ({
                id: client.userId,
                name: client.name,
                email: client.email,
                profilePic: client.profilePic || ""
            }));
    }
}