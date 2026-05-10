import { inject, injectable } from "tsyringe";
import { ISendMessage } from "application/interfaces/chat/i-send-message";
import { ChatMessageRequestDTO } from "application/dto/chat/message-dto";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { EventEmitterService } from "domain/services/i-event-emitter";
import { ChatMapper } from "application/mappers/chat-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class SendMessage implements ISendMessage {
  constructor(
    @inject(I_MESSAGE_REPO_TOKEN)
    private readonly _messageRepository: IMessageRepo,

    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo,

    @inject(EventEmitterService) private readonly _eventEmitter: EventEmitterService
  ) { }

  async execute(messageRequest: ChatMessageRequestDTO): Promise<void> {
    const { receiverId } = messageRequest;
    let { chatId } = messageRequest;

    if (!chatId) {
      const chatEntity = ChatMapper.toChatEntity(messageRequest);

      const createdChat = await this._chatRepository.establishChat(chatEntity);

      chatId = createdChat.chatId;
    }


    const messageEntity = ChatMapper.toMessageEntity({
      ...messageRequest,
      chatId
    });

    const savedMessage = await this._messageRepository.saveMessage(messageEntity);

    const chatRoom = await this._chatRepository.findById(chatId);

    if (!chatRoom) {
      throw new AppError(ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const currentUnread = chatRoom.unreadCount.get(receiverId) || 0;
    chatRoom.unreadCount.set(receiverId, currentUnread + 1);

    chatRoom.lastMessageId = savedMessage.messageId;

    await this._chatRepository.updateChat(chatId, chatRoom);

    this._eventEmitter.emit("MESSAGE_SENT", {
      receiverId,
      payload: ChatMapper.toMessageReceiverDTO(savedMessage)
    });
  }
}