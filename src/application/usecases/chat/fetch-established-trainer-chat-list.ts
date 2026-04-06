import { inject, injectable } from "tsyringe";
import { IChatRepo } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { ChatListResponseDTO } from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchEstablishedTrainerChatList implements IFetchChatList<ChatListResponseDTO> {
    constructor(
        @inject("IChatRepo") private _chatRepo: IChatRepo
    ) { }

    async execute(id: string): Promise<ChatListResponseDTO[]> {

        const chatList = await this._chatRepo.getChatListForTrainer(id);
        return chatList.map((chat) => ChatMapper.toTrainerChatListResponseDTO(chat, id));
    }
}