
import { NotificationEntity } from "domain/entities/NotificationEntity";
import { randomUUID } from "crypto";
import { NotificationResponseDTO } from "application/dto/notification/notification.dro";
import { formatDistanceToNow } from 'date-fns';
export const NotificationMapper = {
  toCreateEntity(data: { title: string, message: string, recipientId: string, senderId: string }): NotificationEntity {
    return new NotificationEntity(
      randomUUID(),   
      data.title,      
      data.message,   
      data.recipientId, 
      false,           
      data.senderId    
    );
  },

toResponseDTO(entity: NotificationEntity): NotificationResponseDTO {
    const date = entity.createdAt || new Date();
    
    return {
      _id: entity.notificationId || "",
      title: entity.title,
      message: entity.message,
      isRead: entity.isRead,
      time: formatDistanceToNow(date, { addSuffix: true }) 
    };
  }
};