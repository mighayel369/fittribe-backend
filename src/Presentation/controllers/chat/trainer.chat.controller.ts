
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IFetchChatList } from 'application/interfaces/chat/i-fetch-chat-list';
import { ChatListResponseDTO, NonEstablishedChatListResponseDTO } from "application/dto/chat/chat-list.dto";
import { IgetMessages } from 'application/interfaces/chat/i-get-messages';

@injectable()
export class TrainerChatController {
    constructor(
        @inject("FetchEstablishedTrainerChatList")
        private _fetchEstablishedChats: IFetchChatList<ChatListResponseDTO>,

        @inject("FetchNonEstablishedTrainerChatList")
        private _fetchNonEstablishedChats: IFetchChatList<NonEstablishedChatListResponseDTO>,

        @inject("IgetMessages")
        private _fetchMessages: IgetMessages
    ) { }

    getEstablishedChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    getDiscoveryClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.user as { id: string };

            const discoveryList = await this._fetchNonEstablishedChats.execute(id);

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