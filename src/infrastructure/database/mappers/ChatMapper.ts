import { ChatEntity } from "domain/entities/ChatEntity";
import { ChatDocument } from "../models/ChatModel";
import { MessageMapper } from "./MessageMapper";

export const ChatMapper = {

  toEntity(doc: any): ChatEntity {
    const unreadMap = doc.unreadCount instanceof Map
      ? doc.unreadCount
      : new Map(Object.entries(doc.unreadCount || {}));

    return new ChatEntity(
      doc.chatId,
      doc.participants,
      unreadMap, 
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
      typeof doc.lastMessageDetails === 'object' && doc.lastMessageDetails !== null
        ? MessageMapper.toEntity(doc.lastMessageDetails)
        : doc.lastMessage,
    );
  },

toDocument(entity: ChatEntity): Partial<ChatDocument> {
    return {
      chatId: entity.chatId,
      participants: entity.participants,
      lastMessage: typeof entity.lastMessage === 'object'
        ? (entity.lastMessage as any).messageId
        : entity.lastMessage,
      unreadCount: Object.fromEntries(entity.unreadCount) as any,
      isActive: entity.isActive,
    };
  }
};