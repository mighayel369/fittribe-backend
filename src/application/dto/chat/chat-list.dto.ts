export interface ChatListResponseDTO {
    name: string;
    profilePic: string;
    id:string,
    lastMessage: string;
    lastMessageTime: string;
    unReadCount: number;
    chatId: string;
}

export interface NonEstablishedChatListResponseDTO{
    name:string,
    email:string,
    profilePic:string,
    id:string
}