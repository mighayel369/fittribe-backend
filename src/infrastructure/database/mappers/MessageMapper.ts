
import { MessageEntity } from "../../../domain/entities/MessageEntity";
import { MessageDocument } from "../models/MessageModel";

export const MessageMapper = {

  toEntity(doc: MessageDocument): MessageEntity {
    return new MessageEntity(
      doc.messageId,
      doc.chatId,
      doc.senderId,
      doc.content,
      doc.type,
      doc.isRead,
      doc.isActive,
      doc.file ? {
        url: doc.file.url,
        mimeType: doc.file.mimeType,
        size: doc.file.size
      } : undefined,
      doc.createdAt,
      doc.updatedAt
    );
  },

  toDocument(entity: MessageEntity): Partial<MessageDocument> {
    return {
      messageId: entity.messageId,
      chatId: entity.chatId,
      senderId: entity.senderId,
      content: entity.content,
      type: entity.type,
      isRead: entity.isRead,
      isActive: entity.isActive,
      file: entity.file,
    };
  }
};