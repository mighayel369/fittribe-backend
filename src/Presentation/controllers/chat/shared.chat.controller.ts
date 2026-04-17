import { I_GET_CHAT_ID_TOKEN, IGetChatId } from 'application/interfaces/chat/i-get-chat-id';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { I_GET_MESSAGES_TOKEN, IgetMessages } from 'application/interfaces/chat/i-get-messages';
import { I_MARK_MESSAGE_AS_READ_TOKEN, IMarkMessageAsRead } from 'application/interfaces/chat/i-mark-as-read';
@injectable()
export class SharedChatController {
    constructor(
        @inject(I_GET_CHAT_ID_TOKEN) private _getChatId: IGetChatId,

        @inject(I_GET_MESSAGES_TOKEN)
        private _fetchMessages: IgetMessages,

        @inject(I_MARK_MESSAGE_AS_READ_TOKEN) private _markMessageAsRead: IMarkMessageAsRead
    ) { }

    getChatId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as { id: string })?.id;
            const receiverId = req.params.receiverId;
            if (!receiverId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST)
            }
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
            const chatId = req.params.chatId
            if (!chatId) {
                throw new AppError("ChatId Missing", HttpStatus.BAD_REQUEST)
            }
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
            const chatId = req.params.chatId
            if (!chatId) {
                throw new AppError("ChatId Missing", HttpStatus.BAD_REQUEST)
            }
            await this._markMessageAsRead.execute(chatId, id)

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Marked All Your Messages As Read"
            });
        } catch (error) {
            next(error);
        }
    }
}