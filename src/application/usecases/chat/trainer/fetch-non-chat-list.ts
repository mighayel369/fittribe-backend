import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";

import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";

import { NonEstablishedChatListResponseDTO, TrainerChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchNonEstablishedTrainerChatList
  implements IFetchChatList<TrainerChatListRequestDTO, NonEstablishedChatListResponseDTO[]> {

  constructor(
    @inject(I_CHAT_REPO_TOKEN) private readonly _chatRepository: IChatRepo,
    @inject(I_USER_REPO_TOKEN) private readonly _userRepository: IUserRepo
  ) { }

  async execute(trainerQuery: TrainerChatListRequestDTO): Promise<NonEstablishedChatListResponseDTO[]> {
    const { trainerId, searchQuery } = trainerQuery;

    const establishedChats = await this._chatRepository.getChatListForTrainer(trainerId);

    const establishedClientIds = establishedChats.map(item => item.user.userId);


    const excludeIds = [...establishedClientIds, trainerId];


    const potentialClients = await this._userRepository.findPotentialClients(
      excludeIds,
      searchQuery
    );

    return potentialClients.map(client => ChatMapper.toNonEstablishedChatDTO(client));
  }
}