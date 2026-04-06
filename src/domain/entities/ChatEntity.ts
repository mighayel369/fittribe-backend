import { MessageEntity } from "./MessageEntity";
export class ChatEntity {
  constructor(
    public readonly chatId: string,
    public readonly participants: string[],
    public unreadCount: Map<string, number> = new Map(),
    public isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public lastMessage?: (MessageEntity | string),
  ) { }
}