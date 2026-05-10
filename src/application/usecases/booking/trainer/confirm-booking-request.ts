import { inject, injectable } from "tsyringe";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";

@injectable()
export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo,

    @inject(I_NOTIFICATION_SERVICE_TOKEN)
    private readonly _notificationService: INotificationService,

    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(bookingId: string): Promise<void> {

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    bookingRecord.confirm();

    const { trainerId, userId, date, totalAmount } = bookingRecord;

    if (!trainerId) {
      throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
    }

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);

    await this._walletRepository.convertHoldToBalance(trainerId, bookingId);
    await this._walletRepository.convertHoldToBalance(config.ADMIN, bookingId);

    await this._handleNotifications(userId, date, totalAmount);
  }

  private async _handleNotifications(
    userId: string,
    date: Date,
    amount: number
  ): Promise<void> {

    const userNotif = NotificationMapper.toCreateEntity({
      message: `Your booking on ${date.toDateString()} has been confirmed.`,
      title: "Booking Confirmed",
      recipientId: userId,
      senderId: "SYSTEM"
    });

    const adminNotif = NotificationMapper.toCreateEntity({
      message: `Platform earnings of ₹${amount} credited.`,
      title: "Revenue Credited",
      recipientId: config.ADMIN,
      senderId: "SYSTEM"
    });

    await Promise.all([
      this._notificationRepository.addNotification(userNotif),
      this._notificationRepository.addNotification(adminNotif)
    ]);

    await Promise.all([
      this._notificationService.notifyUser(
        userId,
        NotificationMapper.toResponseDTO(userNotif)
      ),
      this._notificationService.notifyUser(
        config.ADMIN,
        NotificationMapper.toResponseDTO(adminNotif)
      )
    ]);
  }
}