import { IMessageRepo } from "domain/repositories/IMessageRepo";
import { BaseRepository } from "./BaseRepository";
import { MessageDocument, MessageModel } from "../models/MessageModel";
import { MessageEntity } from "domain/entities/MessageEntity";
import { Model } from "mongoose";
import { MessageMapper } from "../mappers/MessageMapper";

export class MessageRepoImpl extends BaseRepository<MessageDocument, MessageEntity> implements IMessageRepo {
  protected model: Model<MessageDocument> = MessageModel;

  protected toEntity(doc: MessageDocument): MessageEntity {
    return MessageMapper.toEntity(doc);
  }

  async saveMessage(message: MessageEntity): Promise<MessageEntity> {
    const savedDoc = await this.model.create(message);
    return this.toEntity(savedDoc);
  }

  async getChatHistory(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.model.find({ chatId }).sort({ createdAt: 1 });
    return messages.map(msg => this.toEntity(msg));
  }

  async markAsRead(chatId: string, receiverId: string): Promise<void> {
    await this.model.updateMany(
      {
        chatId: chatId,
        isRead: false,
        senderId: { $ne: receiverId }
      },
      {
        $set: { isRead: true }
      }
    );
  }
}