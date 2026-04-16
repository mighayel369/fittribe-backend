import { inject, injectable } from "tsyringe";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { ChatListResponseDTO, TrainerChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchEstablishedTrainerChatList implements IFetchChatList<TrainerChatListRequestDTO, ChatListResponseDTO> {
    constructor(
      @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo,
    ) { }

    async execute(input: TrainerChatListRequestDTO): Promise<ChatListResponseDTO[]> {
        const { trainerId, searchQuery } = input;
        const chatList = await this._chatRepo.getChatListForTrainer(trainerId, searchQuery);
        return chatList.map((chat) => ChatMapper.toTrainerChatListResponseDTO(chat, trainerId));
    }
}