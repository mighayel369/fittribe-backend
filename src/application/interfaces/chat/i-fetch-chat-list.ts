
export interface IFetchChatList<responseDTO>{
    execute(id:string):Promise<responseDTO[]>
}