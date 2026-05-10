import mongoose, { Schema, Document } from "mongoose";
import { MessageEntity } from "domain/entities/MessageEntity";
import { MessageType } from "domain/constants/message-type";
export interface MessageDocument extends Document, MessageEntity { }

const MessageSchema = new Schema<MessageDocument>({
    messageId: { type: String, required: true, unique: true },
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(MessageType),
        default: MessageType.TEXT
    },
    file: {
        url: { type: String },
        mimeType: { type: String },
        size: { type: Number },
        name: { type: String }
    },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

MessageSchema.loadClass(MessageEntity)

export const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);