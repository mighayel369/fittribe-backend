
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, IFetchChatList } from 'application/interfaces/chat/i-fetch-chat-list';
import { NonEstablishedChatListResponseDTO } from 'application/dto/chat/trainer/client-list.dto';
import { ChatListResponseDTO } from 'application/dto/chat/shared/chat-list-response.dto';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { ChatQueryDTO } from 'application/dto/chat/shared/chat-query.schema';
@injectable()
export class TrainerChatController {
    constructor(
        @inject(I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN)
        private readonly _fetchEstablishedChatsUseCase: IFetchChatList<ChatListResponseDTO>,

        @inject(I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN)
        private readonly _fetchNonEstablishedChatsUseCase: IFetchChatList<NonEstablishedChatListResponseDTO>,
    ) { }

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const query = req.query as unknown as ChatQueryDTO


            const establishedChatList = await this._fetchEstablishedChatsUseCase.execute(query, trainerId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.CHAT_ESTABLIASHED,
                data: establishedChatList
            });

        } catch (error) {
            next(error);
        }
    }

    getDiscoveryClients = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const trainerId = req.user?.user.id;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const query = req.query as unknown as ChatQueryDTO;

            const discoveryChatList = await this._fetchNonEstablishedChatsUseCase.execute(
                query,
                trainerId
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.NON_ESTABLISHED_CLIENTS_FETCHED,
                data: discoveryChatList
            });
        } catch (error) {
            next(error);
        }
    }
}