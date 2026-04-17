import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { ICancelBooking } from "application/interfaces/booking/i-cancel-booking.usecase";
import config from "config";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BOOKING_STATUS } from "utils/Constants";
@injectable()
export class CancelUserBookingUseCase implements ICancelBooking { 
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
    @inject(I_WALLET_REPO_TOKEN) private _walletRepo: IWalletRepo
  ) {}

  async execute(bookingId: string): Promise<void> {

    const booking = await this._bookingRepo.findBookingById(bookingId);

    if (!booking) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    if (!booking.canCancel()) {
      throw new AppError(ERROR_MESSAGES.CANCELLATION_TIME_OVER, HttpStatus.BAD_REQUEST);
    }

    const userId = booking.userId;
    

    await this._walletRepo.releaseHoldWithoutBalance(booking.trainerId, bookingId);
    await this._walletRepo.releaseHoldWithoutBalance(config.ADMIN, bookingId);

    await this._walletRepo.credit(
      userId, 
      booking.totalAmount, 
      "refund", 
      bookingId
    );

    await this._bookingRepo.updateBookingStatus(bookingId, BOOKING_STATUS.CANCELED);
  }
}