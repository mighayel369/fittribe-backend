import { inject, injectable } from "tsyringe";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";
import { ISendMessage } from "application/interfaces/chat/i-send-message";
import { ChatMessageRequestDTO } from "application/dto/chat/message-dto";
import { I_CHAT_SERVICE_TOKEN, IChatService } from "domain/services/i-chat-service";
import { ChatMapper } from "application/mappers/chat-mapper";
import { AppError } from "domain/errors/AppError";
@injectable()
export class SendMessage implements ISendMessage {
  constructor(
    @inject(I_MESSAGE_REPO_TOKEN) private _messageRepo: IMessageRepo,
    @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo,
    @inject(I_CHAT_SERVICE_TOKEN) private _chatService: IChatService
  ) { }

  async execute(input: ChatMessageRequestDTO): Promise<void> {
    let { chatId, receiverId } = input;
    console.log('hello chat id here',chatId)
    if (!chatId) {
      const newChat = ChatMapper.toChatEntity(input);
      await this._chatRepo.establishChat(newChat);
      chatId = newChat.chatId;
      input.chatId = chatId;
    }

    const messageEntity = ChatMapper.toMessageEntity(input);
    const savedMessage = await this._messageRepo.saveMessage(messageEntity);
    const chatEntity = await this._chatRepo.findById(chatId);
    if (!chatEntity) throw new AppError('Cannot find chat');
    const currentUnread = chatEntity.unreadCount.get(receiverId) || 0;
    chatEntity.unreadCount.set(receiverId, currentUnread + 1);
    chatEntity.lastMessage = savedMessage.messageId;
    console.log('chat from usecase',chatEntity)
    await this._chatRepo.updateChat(chatId, chatEntity);
    
    await this._chatService.sendMessage(
      receiverId, 
      ChatMapper.toMessageReceiverDTO(savedMessage)
    );
  }
}