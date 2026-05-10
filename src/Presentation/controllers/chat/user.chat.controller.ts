import { ChatListResponseDTO, ClientChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { PAGINATION } from "utils/Constants";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { AppError } from "domain/errors/AppError";

@injectable()
export class UserChatController {
    constructor(
        @inject(I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN)
        private readonly _fetchEstablishedChatsUseCase: IFetchChatList<ClientChatListRequestDTO, ChatListResponseDTO>
    ) { }

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const fetchPayload: ClientChatListRequestDTO = {
                clientId: userId,
                limit: PAGINATION.CHAT_DASHBOARD_LIMIT,
                searchQuery: String(req.query.search || '')
            };

            const establishedChatList = await this._fetchEstablishedChatsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.ESTABLISHED_CLIENTS_CHATS_FETCHED,
                data: establishedChatList
            });
        } catch (error) {

            next(error);
        }
    }
}