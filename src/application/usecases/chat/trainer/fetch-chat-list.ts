import { inject, injectable } from "tsyringe";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { ChatListArrayResponseSchema, ChatListResponseDTO } from "application/dto/chat/shared/chat-list-response.dto";
import { ChatQueryDTO } from "application/dto/chat/shared/chat-query.schema";
import { ChatMapper } from "application/mappers/chat-mapper";
@injectable()
export class FetchEstablishedTrainerChatList implements IFetchChatList<ChatListResponseDTO[]> {

  constructor(
    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository:
      IChatRepo
  ) { }

  async execute(trainerQuery: ChatQueryDTO, trainerId: string): Promise<ChatListResponseDTO[]> {

    const { search } = trainerQuery;

    const activeChats =
      await this._chatRepository
        .getChatListForTrainer(
          trainerId,
          search
        );

    const mappedChats = activeChats.map((item) =>
        ChatMapper.toTrainerChatListDTO(
          item,
          trainerId
        )
      );

    return ChatListArrayResponseSchema.parse(
      mappedChats
    );
  }
}