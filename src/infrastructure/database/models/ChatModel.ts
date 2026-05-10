import mongoose, { Schema, Document } from "mongoose";
import { ChatEntity } from "domain/entities/ChatEntity";
export interface ChatDocument extends Document, ChatEntity { }

const ChatSchema = new Schema<ChatDocument>({
    chatId: { type: String, required: true, unique: true },
    participants: [{ type: String, required: true }],
    lastMessageId: { type: String },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

ChatSchema.loadClass(ChatEntity)

export const ChatModel = mongoose.model<ChatDocument>("Chat", ChatSchema);