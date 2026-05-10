import { inject, injectable } from "tsyringe";
import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";
import { PAYMENT_STATUS } from "domain/constants/payment-status";
import { TRANSACTION_SOURCE } from "domain/constants/wallet-constants";

@injectable()
export class DeclineBookingUseCase implements IDeclineBookingUseCase {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo
  ) { }

  async execute(bookingId: string, reason: string): Promise<void> {

    if (!reason || reason.trim().length < 3) {
      throw new AppError(ERROR_MESSAGES.REASON_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!bookingRecord.canBeDeclined()) {
      throw new AppError(ERROR_MESSAGES.DECLINE_BOOKING_ERROR, HttpStatus.BAD_REQUEST);
    }


    bookingRecord.decline(reason);


    if (bookingRecord.payment.status === PAYMENT_STATUS.HOLD) {

      await this._walletRepository.releaseHoldWithoutBalance(
        bookingRecord.trainerId,
        bookingId
      );

      await this._walletRepository.releaseHoldWithoutBalance(
        config.ADMIN,
        bookingId
      );

      await this._walletRepository.credit(
        bookingRecord.userId,
        bookingRecord.totalAmount,
        TRANSACTION_SOURCE.REFUND,
        bookingId
      );
    }

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}