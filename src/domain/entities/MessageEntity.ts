
export class MessageEntity {
  constructor(
    public readonly messageId: string,
    public readonly chatId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: "text" | "call" | "image",
    public readonly isRead: boolean = false,
    public readonly isActive: boolean = true,
    public readonly file?: {
      url: string;
      mimeType: string;
      size: number;
    },
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}