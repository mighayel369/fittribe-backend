import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { ChatListResponseDTO } from "application/dto/chat/shared/chat-list-response.dto";
import { ChatMapper } from "application/mappers/chat-mapper";
import { ChatQueryDTO } from "application/dto/chat/shared/chat-query.schema";


@injectable()
export class FetchEstablishedClientChatList implements IFetchChatList<ChatListResponseDTO[]> {
  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(clientQuery: ChatQueryDTO, userId: string): Promise<ChatListResponseDTO[]> {
    const { search } = clientQuery;

    const activeChats = await this._chatRepository.getChatListForUser(userId, search);

    return activeChats.map(item => ChatMapper.toClientChatListDTO(item, userId));
  }
}