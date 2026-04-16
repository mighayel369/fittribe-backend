import { inject, injectable } from "tsyringe";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { ChatListResponseDTO, ClientChatListRequestDTO, TrainerChatListRequestDTO, } from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchEstablishedClientChatList implements IFetchChatList<ClientChatListRequestDTO, ChatListResponseDTO> {
    constructor(
        @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo
    ) { }

    async execute(input: ClientChatListRequestDTO): Promise<ChatListResponseDTO[]> {
        const { clientId, searchQuery } = input;

        const chatList = await this._chatRepo.getChatListForUser(clientId, searchQuery);
        
        return chatList.map((chat) => ChatMapper.toClientChatListResponseDTO(chat, clientId));
    }
}