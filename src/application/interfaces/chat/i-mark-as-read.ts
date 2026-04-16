export const I_MARK_MESSAGE_AS_READ_TOKEN = Symbol("I_MARK_MESSAGE_AS_READ_TOKEN");

export interface IMarkMessageAsRead{
    execute(chatId:string,receiverId:string):Promise<void>
}