import { MessageType } from "domain/constants/message-type";

export interface ChatMessageResponseDTO {
    sender: string;
    content: string;
    date: string;
    chatId: string;
    type: MessageType;
    file?: {
        url: string;
        mimeType: MessageType;
        size: number;
        name: string
    };
}

export interface ChatMessageRequestDTO {
    senderId: string,
    receiverId: string,
    content: string,
    type: MessageType,
    chatId?: string
    file?: {
        url: string,
        mimeType: MessageType,
        size: number;
        name: string
    }
}