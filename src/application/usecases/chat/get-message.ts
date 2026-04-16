import { ChatMessageResponseDTO } from "application/dto/chat/message-dto";
import { IgetMessages } from "application/interfaces/chat/i-get-messages";
import { inject,injectable } from "tsyringe";
import { I_MESSAGE_REPO_TOKEN, IMessageRepo } from "domain/repositories/IMessageRepo";
import { ChatMapper } from "application/mappers/chat-mapper";
@injectable()
export class getMessage implements IgetMessages{
    constructor( @inject(I_MESSAGE_REPO_TOKEN) private _messageRepo: IMessageRepo){}
    async execute(chatId: string): Promise<ChatMessageResponseDTO[]> {
        let messages=await this._messageRepo.getChatHistory(chatId)
        return messages.map(message=>ChatMapper.toMessageReceiverDTO(message))
    }
}