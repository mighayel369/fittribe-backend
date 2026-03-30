import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import NotificationModel, { INotification } from "../models/NotificationModel";
import { NotificationEntity } from "domain/entities/NotificationEntity";
import { NotificationMapper } from "../mappers/NotificationMapper";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";

@injectable()
export class NotificationRepository
    extends BaseRepository<INotification, NotificationEntity>
    implements INotificationRepo {


    protected model = NotificationModel;
    protected toEntity = NotificationMapper.toEntity;

    async addNotification(data: NotificationEntity): Promise<void> {
        const dbData = NotificationMapper.toDatabase(data);
        await this.model.create(dbData);
    }

    async markAsRead(notificationId: string): Promise<void> {
        await this.model.findOneAndUpdate({ notificationId }, { isRead: true });
    }



    async markAllAsRead(recipientId: string): Promise<void> {
        await this.model.updateMany(
            { recipientId: recipientId, isRead: false },
            { $set: { isRead: true } }
        );
    }
    
    async getByUserId(userId: string): Promise<NotificationEntity[]> {
        const docs = await this.model.find({ recipientId: userId }).sort({ createdAt: -1 });
        return docs.map(doc => this.toEntity(doc));
    }

    async getByNotificationId(id: string): Promise<NotificationEntity | null> {
        const doc = await this.model.findOne({ notificationId: id })
        return doc ? this.toEntity(doc) : null;
    }
}