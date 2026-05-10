import mongoose, { Schema, Document } from 'mongoose';
import { NotificationEntity } from 'domain/entities/NotificationEntity';
export interface INotification extends Document, NotificationEntity { }


const NotificationSchema = new Schema<INotification>({
    notificationId: { type: String, required: true, unique: true },
    recipientId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true })

NotificationSchema.loadClass(NotificationEntity)

export default mongoose.model<INotification>("Notification", NotificationSchema)


