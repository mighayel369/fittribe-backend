import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    notificationId:string,
    recipientId: string,
    senderId: string,
    title: string,
    message: string,
    isRead: boolean,
    createdAt:Date
}


const NotificationSchema = new Schema<INotification>({
    notificationId:{type:String, required: true,unique:true},
    recipientId: { type: String, required: true, index: true },
    senderId: { type: String,required:true},
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
},{timestamps:true})

export default mongoose.model<INotification>("Notification",NotificationSchema)


