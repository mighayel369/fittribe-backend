export class ChatEntity {
  constructor(
    public readonly chatId: string,
    public readonly participants: string[],
    public unreadCount: Map<string, number> = new Map(),
    public isActive = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public lastMessageId?: string,
  ) { }
}

export interface ChatParticipantInfo {
  name: string;
  profilePic?: string;
  userId: string;
}

export interface ChatSummary {
  chat: ChatEntity;
  participant: ChatParticipantInfo;
}