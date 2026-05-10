import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import {
  ChatListResponseDTO,
  ClientChatListRequestDTO
} from "application/dto/chat/chat-list.dto";
import { ChatMapper } from "application/mappers/chat-mapper";


@injectable()
export class FetchEstablishedClientChatList implements IFetchChatList<ClientChatListRequestDTO, ChatListResponseDTO[]> {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(clientQuery: ClientChatListRequestDTO): Promise<ChatListResponseDTO[]> {
    const { clientId, searchQuery } = clientQuery;

    const activeChats = await this._chatRepository.getChatListForUser(clientId, searchQuery);

    return activeChats.map(item => ChatMapper.toClientChatListDTO(item, clientId));
  }
}