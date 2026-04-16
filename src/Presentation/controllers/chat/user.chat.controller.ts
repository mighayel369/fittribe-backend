import { ChatListResponseDTO, ClientChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { PAGINATION } from "utils/Constants";

@injectable()
export class UserChatController {
    constructor(@inject(I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN) private _fetchEstablishedChats: IFetchChatList<ClientChatListRequestDTO, ChatListResponseDTO>) {}

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user as { id: string };
            
            let input: ClientChatListRequestDTO = {
                clientId: userId,
                limit: PAGINATION.CHAT_DASHBOARD_LIMIT,
                searchQuery: String(req.query.search || '')
            };

            const chatList = await this._fetchEstablishedChats.execute(input);

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