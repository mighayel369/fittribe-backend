import { I_GET_CHAT_ID_TOKEN, IGetChatId } from 'application/interfaces/chat/i-get-chat-id';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { I_GET_MESSAGES_TOKEN, IgetMessages } from 'application/interfaces/chat/i-get-messages';
import { I_MARK_MESSAGE_AS_READ_TOKEN, IMarkMessageAsRead } from 'application/interfaces/chat/i-mark-as-read';
import { ChatParams, ReceiverParams } from 'Presentation/interfaces/request.params';
import { IUploadChatFiles, I_UPLOAD_CHAT_FILES } from 'application/interfaces/chat/i-upload-files';
@injectable()
export class SharedChatController {
    constructor(
        @inject(I_GET_CHAT_ID_TOKEN)
        private readonly _getChatIdUseCase: IGetChatId,

        @inject(I_GET_MESSAGES_TOKEN)
        private readonly _fetchMessagesUseCase: IgetMessages,

        @inject(I_MARK_MESSAGE_AS_READ_TOKEN)
        private readonly _markMessageAsReadUseCase: IMarkMessageAsRead,

        @inject(I_UPLOAD_CHAT_FILES)
        private readonly _uploadChatFile: IUploadChatFiles

    ) { }

    getChatId = async (req: Request<ReceiverParams>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const { receiverId } = req.params;

            if (!receiverId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const chatSession = await this._getChatIdUseCase.execute(userId, receiverId);

            if (chatSession) {
                res.status(HttpStatus.OK).json({
                    success: true,
                    exists: true,
                    chatId: chatSession.chatId
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                exists: false
            });

        } catch (err) {
            next(err);
        }
    }

    getMessages = async (req: Request<ChatParams>, res: Response, next: NextFunction) => {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                throw new AppError(ERROR_MESSAGES.CHATID_INVALID, HttpStatus.BAD_REQUEST);
            }



            const chatMessages = await this._fetchMessagesUseCase.execute(chatId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.CHAT_MESSAGED_FETCHED,
                data: chatMessages
            });
        } catch (error) {
            next(error);
        }
    }

    markMessageAsRead = async (req: Request<ChatParams>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const { chatId } = req.params;

            if (!chatId) {
                throw new AppError(ERROR_MESSAGES.CHATID_INVALID, HttpStatus.BAD_REQUEST);
            }

            await this._markMessageAsReadUseCase.execute(chatId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.MARKED_ALL_MESSAGES_AS_READ
            });
        } catch (error) {
            next(error);
        }
    }

    uploadChatFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatFile = req.file;
            if (!chatFile) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            const result = await this._uploadChatFile.upload(chatFile);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CHAT.FILE_UPLOADED,
                fileUrl: result.url,
                resource_type: result.resource_type
            });
        } catch (error) {
            next(error);
        }
    }
}