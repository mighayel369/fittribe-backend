import { inject, injectable } from "tsyringe";
import { ICancelBooking } from "application/interfaces/booking/i-cancel-booking.usecase";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";
import { TRANSACTION_SOURCE } from "domain/constants/wallet-constants";

@injectable()
export class CancelUserBookingUseCase implements ICancelBooking {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo
  ) { }


  async execute(bookingId: string): Promise<void> {

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!bookingRecord.canCancel()) {
      throw new AppError(ERROR_MESSAGES.CANCELLATION_TIME_OVER, HttpStatus.BAD_REQUEST);
    }

    await Promise.all([
      this._walletRepository.releaseHoldWithoutBalance(bookingRecord.trainerId, bookingId),
      this._walletRepository.releaseHoldWithoutBalance(config.ADMIN, bookingId)
    ]);

    await this._walletRepository.credit(
      bookingRecord.userId,
      bookingRecord.totalAmount,
      TRANSACTION_SOURCE.REFUND,
      bookingId
    );

    bookingRecord.cancel();

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}