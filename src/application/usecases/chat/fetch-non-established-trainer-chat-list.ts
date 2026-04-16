import { NonEstablishedChatListResponseDTO, TrainerChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";

@injectable()
export class FetchNonEstablishedTrainerChatList implements IFetchChatList<TrainerChatListRequestDTO,NonEstablishedChatListResponseDTO> {
    constructor(
        @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo,
        @inject(I_USER_REPO_TOKEN) private readonly _userRepo: IUserRepo
    ) { }

async execute(input: TrainerChatListRequestDTO): Promise<NonEstablishedChatListResponseDTO[]> {
    const { trainerId, searchQuery } = input;
    const chatList = await this._chatRepo.getChatListForTrainer(trainerId,searchQuery);
    const establishedIds = new Set(chatList.map(chat => chat.clientInfo.userId));

    const allClients = await this._userRepo.findActiveClients();

    return allClients
        .filter(client => {
            const isNotMe = client.userId !== trainerId;
            const isNotEstablished = !establishedIds.has(client.userId);
            const matchesSearch = searchQuery 
                ? client.name.toLowerCase().includes(searchQuery.toLowerCase()) 
                : true;
            
            return isNotMe && isNotEstablished && matchesSearch;
        })
        .map(client => ({
            id: client.userId,
            name: client.name,
            email: client.email,
            profilePic: client.profilePic || ""
        }));
}
}