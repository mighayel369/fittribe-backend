export const I_GET_CHAT_ID_TOKEN = Symbol("I_GET_CHAT_ID_TOKEN");

export interface IGetChatId{
    execute(senderId:string,receiverId:string):Promise<{ chatId: string } | null>
}