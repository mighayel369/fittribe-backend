import { IGetChatId } from 'application/interfaces/chat/i-get-chat-id';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { IgetMessages } from 'application/interfaces/chat/i-get-messages';
import { IMarkMessageAsRead } from 'application/interfaces/chat/i-mark-as-read';
@injectable()
export class SharedChatController {
    constructor(
        @inject("GetChatId") private _getChatId: IGetChatId,

        @inject("IgetMessages")
        private _fetchMessages: IgetMessages,

        @inject("IMarkMessageAsRead") private _markMessageAsRead: IMarkMessageAsRead
    ) { }

    getChatId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as { id: string })?.id;
            const receiverId = req.params.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getChatId.execute(userId, receiverId);

            if (result) {
                res.status(HttpStatus.OK).json({
                    success: true,
                    exists: true,
                    chatId: result.chatId
                });
                return
            }

            res.status(HttpStatus.OK).json({
                success: true,
                exists: false
            });

        } catch (err) {
            next(err);
        }
    }

    getMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const chatId = req.params.id
            const messages = await this._fetchMessages.execute(chatId)
            console.log(messages)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Discovery clients fetched successfully",
                data: messages
            });
        } catch (error) {
            next(error);
        }
    }


    markMessageAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const chatId = req.params.id
            await this._markMessageAsRead.execute(chatId,id)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Marked All Your Messages As Read"
            });
        } catch (error) {
            next(error);
        }
    }
}