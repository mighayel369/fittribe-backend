import { ChatQueryDTO } from "application/dto/chat/shared/chat-query.schema";


export const I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN = Symbol("I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN");
export const I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN = Symbol("I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN");
export const I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN = Symbol("I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN");
export interface IFetchChatList<responseDTO> {
    execute(input:ChatQueryDTO,ownerId:string): Promise<responseDTO>
}