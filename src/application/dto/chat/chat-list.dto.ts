import { PaginationInputDTO } from "../common/PaginationDto";

export interface TrainerChatListRequestDTO extends Omit<PaginationInputDTO, 'filter' | 'currentPage'> {
    trainerId: string;
}

export interface ClientChatListRequestDTO extends Omit<PaginationInputDTO, 'filter' | 'currentPage'> {
    clientId: string;
}
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