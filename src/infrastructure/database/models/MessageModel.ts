import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
    messageId: string;
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "call" | "image";
    file?: {
        url: string;
        mimeType: string;
        size: number;
    };
    isRead: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>({
    messageId: { type: String, required: true, unique: true },
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
        type: String, 
        enum: ["text", "call", "image"], 
        default: "text" 
    },
    file: {
        url: { type: String },
        mimeType: { type: String },
        size: { type: Number }
    },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {timestamps: true});

export const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);