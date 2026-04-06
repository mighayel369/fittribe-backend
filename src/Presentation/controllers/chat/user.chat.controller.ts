import { ChatListResponseDTO } from "application/dto/chat/chat-list.dto";
import { IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UserChatController{
    constructor(@inject("FetchEstablishedClientChatList") private _fetchEstablishedChats:IFetchChatList<ChatListResponseDTO>){}

        getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            const chatList = await this._fetchEstablishedChats.execute(id);
            console.log(chatList)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Established chats fetched successfully",
                data: chatList
            });
        } catch (error) {
            next(error);
        }
    }
}