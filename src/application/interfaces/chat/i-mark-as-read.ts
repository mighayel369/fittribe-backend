

export interface IMarkMessageAsRead{
    execute(chatId:string,receiverId:string):Promise<void>
}