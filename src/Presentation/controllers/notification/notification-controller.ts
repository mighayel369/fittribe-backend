import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { I_GET_ALL_NOTIFICATIONS_TOKEN, IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { HttpStatus } from "../../../utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { IMarkAsRead, I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN, I_MARK_NOTIFICATION_AS_READ_TOKEN } from "application/interfaces/notification/i-mark-as-read";
import { NotificationParams } from "Presentation/interfaces/request.params";
import { SUCCESS_MESSAGES } from "utils/SuccessMessages";

@injectable()
export class NotificationController {
    constructor(
        @inject(I_GET_ALL_NOTIFICATIONS_TOKEN)
        private readonly _getNotificationsUseCase: IGetNotification,

        @inject(I_MARK_NOTIFICATION_AS_READ_TOKEN)
        private readonly _markSingleAsReadUseCase: IMarkAsRead,

        @inject(I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN)
        private readonly _markAllAsReadUseCase: IMarkAsRead
    ) { }

    getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const userNotifications = await this._getNotificationsUseCase.execute(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.NOTIFICATION.NOTIFICATION_FETCHED_SUCCESSFULLY,
                notifications: userNotifications
            });
        } catch (error) {
            next(error);
        }
    }

    markAsRead = async (req: Request<NotificationParams>, res: Response, next: NextFunction) => {
        try {
            const { notificationId } = req.params;

            if (!notificationId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._markSingleAsReadUseCase.execute(notificationId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.NOTIFICATION.MARKED_AS_READ
            });
        } catch (error) {
            next(error);
        }
    }

    markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._markAllAsReadUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.NOTIFICATION.ALL_MARKED_AS_READ
            });
        } catch (error) {
            next(error);
        }
    }
}