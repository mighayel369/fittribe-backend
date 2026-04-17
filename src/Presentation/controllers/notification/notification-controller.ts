
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { I_GET_ALL_NOTIFICATIONS_TOKEN, IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { HttpStatus } from "../../../utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { IMarkAsRead, I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN, I_MARK_NOTIFICATION_AS_READ_TOKEN } from "application/interfaces/notification/i-mark-as-read";
@injectable()
export class NotificationController {
    constructor(
        @inject(I_GET_ALL_NOTIFICATIONS_TOKEN) private _getAllNotifications: IGetNotification,
        @inject(I_MARK_NOTIFICATION_AS_READ_TOKEN) private _markAsRead: IMarkAsRead,
        @inject(I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN) private _markAllAsRead: IMarkAsRead
    ) { }


    getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            console.log(id)
            const notifications = await this._getAllNotifications.execute(id);
            console.log(notifications)
            res.status(HttpStatus.OK).json(notifications);
        } catch (error) {
            next(error)

        }
    }

    markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user as { id: string };
            const { notificationId } = req.params;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!notificationId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST)
            }

            await this._markAsRead.execute(notificationId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Notification marked as read"
            });
        } catch (error) {
            next(error);
        }
    }
    markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            await this._markAllAsRead.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Notification marked all as read"
            });
        } catch (error) {
            next(error)
        }
    }
}