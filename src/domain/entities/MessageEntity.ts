import { MessageType } from "domain/constants/message-type";

export class MessageEntity {
  constructor(
    public readonly messageId: string,
    public readonly chatId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly isRead = false,
    public readonly isActive = true,
    public readonly file?: {
      url: string;
      mimeType: MessageType;
      size: number;
      name: string
    },
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) { }
}