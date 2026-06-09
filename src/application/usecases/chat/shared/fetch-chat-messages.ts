import { inject, injectable } from "tsyringe";
import { IgetMessages } from "application/interfaces/chat/i-get-messages";
import { ChatMessageResponseDTO, ChatMessagesResponseSchema } from "application/dto/chat/shared/chat-message.response.dto";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { ChatMapper } from "application/mappers/chat-mapper";

@injectable()
export class GetMessage implements IgetMessages {

  constructor(
    @inject(I_MESSAGE_REPO_TOKEN)
    private readonly _messageRepository: IMessageRepo
  ) { }

  async execute(
    chatId: string
  ): Promise<ChatMessageResponseDTO[]> {

    const messageEntities = await this._messageRepository.getChatHistory(
      chatId
    );


    const mappedMessages = messageEntities.map((message) =>
      ChatMapper.toMessageReceiverDTO(message, null)
    );


    return ChatMessagesResponseSchema.parse(
      mappedMessages
    );
  }
}