export interface ChatMessageResponseDTO{
    sender:string,
    text:string,
    date:string,
    chatId: string
}


export interface ChatMessageRequestDTO{
    senderId:string,
    receiverId:string,
    content:string,
    type:"text",
    chatId:string
}