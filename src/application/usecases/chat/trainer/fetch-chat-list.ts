import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import {
  ChatListResponseDTO,
  TrainerChatListRequestDTO
} from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchEstablishedTrainerChatList implements IFetchChatList<TrainerChatListRequestDTO, ChatListResponseDTO[]> {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(trainerQuery: TrainerChatListRequestDTO): Promise<ChatListResponseDTO[]> {
    const { trainerId, searchQuery } = trainerQuery;


    const activeChats = await this._chatRepository.getChatListForTrainer(
      trainerId,
      searchQuery
    );

    return activeChats.map(item => ChatMapper.toTrainerChatListDTO(item, trainerId));
  }
}