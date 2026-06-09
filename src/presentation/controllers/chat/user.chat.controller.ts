
import { I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";
import { inject, injectable } from "tsyringe";
import { HttpStatus } from "utils/HttpStatus";
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ChatListResponseDTO } from "application/dto/chat/shared/chat-list-response.dto";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";
import { AppError } from "domain/errors/AppError";
import { ChatQueryDTO } from "application/dto/chat/shared/chat-query.schema";

@injectable()
export class UserChatController {
    constructor(
        @inject(I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN)
        private readonly _fetchEstablishedChatsUseCase: IFetchChatList<ChatListResponseDTO>
    ) { }

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const query=req.query as unknown as ChatQueryDTO


            const establishedChatList = await this._fetchEstablishedChatsUseCase.execute(query, userId);

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