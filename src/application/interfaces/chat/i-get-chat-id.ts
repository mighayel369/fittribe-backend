export interface IGetChatId{
    execute(senderId:string,receiverId:string):Promise<{ chatId: string } | null>
}