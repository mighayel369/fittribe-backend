import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import NotificationModel, { INotification } from "../models/NotificationModel";
import { NotificationEntity } from "domain/entities/NotificationEntity";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";

@injectable()
export class NotificationRepository
    extends BaseRepository<INotification>
    implements INotificationRepo {


    protected model = NotificationModel;


    async addNotification(data: NotificationEntity): Promise<void> {
        await this.model.create(data);
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
        return docs
    }

    async getByNotificationId(id: string): Promise<NotificationEntity | null> {
        const doc = await this.model.findOne({ notificationId: id })
        return doc ? doc : null;
    }
}