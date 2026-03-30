import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { AppError } from "domain/errors/AppError";
import config from "config";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BOOKING_STATUS } from "utils/Constants";
import { INotificationService } from "domain/services/i-notification.service";
import { INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
@injectable()
export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
  constructor(
    @inject("BookingRepo") private _bookingRepo: IBookingRepo,
    @inject("WalletRepo") private _walletRepo: IWalletRepo,
    @inject("SocketNotificationService") private _notificationService: INotificationService,
    @inject("INotificationRepo") private _notificationRepo: INotificationRepo) { }

  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!booking.canBeConfirmed()) {
      throw new AppError(
        ERROR_MESSAGES.BOOKING_CONFIRMATION_FAILED(booking.status),
        HttpStatus.BAD_REQUEST
      );
    }

    const trainerId = booking.trainerId;

    if (!trainerId) {
      throw new AppError('Trainer information is missing from booking', HttpStatus.BAD_REQUEST);
    }

    await this._bookingRepo.updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED);


    await this._walletRepo.convertHoldToBalance(trainerId, bookingId);

    await this._walletRepo.convertHoldToBalance(config.ADMIN_WALLET, bookingId);


    const userNotif = NotificationMapper.toCreateEntity({
      message: `Your booking scheduled on ${booking.date.toDateString()} has been confirmed!`,
      title: 'Booking Confirmed',
      recipientId: booking.userId,
      senderId: "SYSTEM_SECURITY"
    });
    console.log(userNotif)
    await this._notificationRepo.addNotification(userNotif);
    await this._notificationService.notifyUser(userNotif.recipientId, NotificationMapper.toResponseDTO(userNotif))
  }
}