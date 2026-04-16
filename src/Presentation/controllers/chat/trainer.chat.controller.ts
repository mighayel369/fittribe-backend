
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, IFetchChatList } from 'application/interfaces/chat/i-fetch-chat-list';
import { ChatListResponseDTO, NonEstablishedChatListResponseDTO, TrainerChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { PAGINATION } from 'utils/Constants';

@injectable()
export class TrainerChatController {
    constructor(
        @inject(I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN)
        private _fetchEstablishedChats: IFetchChatList<TrainerChatListRequestDTO, ChatListResponseDTO>,

        @inject(I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN)
        private _fetchNonEstablishedChats: IFetchChatList<TrainerChatListRequestDTO, NonEstablishedChatListResponseDTO>,
    ) { }

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };

            let input: TrainerChatListRequestDTO = {
                trainerId,
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

    getDiscoveryClients = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };

            let input: TrainerChatListRequestDTO = {
                trainerId,
                limit: PAGINATION.CHAT_DASHBOARD_LIMIT,
                searchQuery: String(req.query.search || '')
            };

            const discoveryList = await this._fetchNonEstablishedChats.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Discovery clients fetched successfully",
                data: discoveryList
            });
        } catch (error) {
            next(error);
        }
    }


}