import { INotification } from "../models/NotificationModel";
import { NotificationEntity } from "domain/entities/NotificationEntity";

export const NotificationMapper = {
    toEntity(doc: INotification): NotificationEntity {
        return new NotificationEntity(
            doc.notificationId,
            doc.title,
            doc.message,
            doc.recipientId,
            doc.isRead,
            doc.senderId,
            doc.createdAt
        );
    },

    toDatabase(entity: NotificationEntity) {
    return {
      notificationId:entity.notificationId,
      title: entity.title,
      message: entity.message,
      recipientId: entity.recipientId,
      isRead: entity.isRead,
      senderId: entity.senderId
    };
  }
};