

export class NotificationEntity {
  constructor(
    public readonly notificationId: string,
    public readonly title: string,
    public readonly message: string,
    public readonly recipientId: string,
    public readonly isRead: boolean = false,
    public readonly senderId: string,
    public readonly createdAt?:Date
  ) {}
}