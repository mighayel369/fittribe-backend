import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { NonEstablishedChatListArraySchema, NonEstablishedChatListResponseDTO } from "application/dto/chat/trainer/client-list.dto";
import { ChatQueryDTO } from "application/dto/chat/shared/chat-query.schema";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class FetchNonEstablishedTrainerChatList implements IFetchChatList<NonEstablishedChatListResponseDTO[]> {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo,

    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(
    query: ChatQueryDTO,
    trainerId: string
  ): Promise<NonEstablishedChatListResponseDTO[]> {

    const { search } = query;
    const establishedChats = await this._chatRepository.getChatListForTrainer(trainerId);

    const establishedClientIds = establishedChats.map(
      item => item.user.userId
    );

    const excludeIds = [
      ...establishedClientIds,
      trainerId
    ];

    const potentialClients = await this._userRepository.findPotentialClients(
      excludeIds,
      search
    );

    const mappedClients = potentialClients.map(client =>
      ChatMapper.toNonEstablishedChatDTO(
        client
      )
    );

    return NonEstablishedChatListArraySchema.parse(
      mappedClients
    );
  }
}