
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetNotification } from "application/interfaces/notification/i-get-notifications";
import { HttpStatus } from "../../../utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
@injectable()
export class NotificationController {
    constructor(
        @inject("GetAllNotification") private _getAllNotifications: IGetNotification,
        @inject("IMarkAsRead") private _markAsRead:IMarkAsRead,
        @inject("MarkAllAsRead") private _markAllAsRead:IMarkAsRead
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
        const { id: notificationId } = req.params;

        if (!userId) {
            throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
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
                success:true,
                message:"Notification marked all as read"
            });
        } catch (error) {
            next(error)
        }
    }
}