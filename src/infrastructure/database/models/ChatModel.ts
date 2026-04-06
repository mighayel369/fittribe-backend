import mongoose, { Schema, Document } from "mongoose";

export interface ChatDocument extends Document {
    chatId: string; 
    participants: string[]; 
    lastMessage: string;
    unreadCount: Map<string, number>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema<ChatDocument>({
    chatId: { type: String, required: true, unique: true },
    participants: [{ type: String, required: true }],
    lastMessage: { type: String},
    unreadCount: { 
        type: Map, 
        of: Number, 
        default: new Map() 
    },
    isActive: { type: Boolean, default: true }
}, {timestamps: true});

export const ChatModel = mongoose.model<ChatDocument>("Chat", ChatSchema);