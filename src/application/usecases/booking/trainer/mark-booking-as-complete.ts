import { inject, injectable } from "tsyringe";
import { IMarkAsComplete } from "application/interfaces/booking/i-mark-as-complete";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class MarkAsComplete implements IMarkAsComplete {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(bookingId: string): Promise<void> {
    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (bookingRecord.status !== BOOKING_STATUS.CONFIRMED) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_CONFIRMED, HttpStatus.BAD_REQUEST);
    }

    bookingRecord.status = BOOKING_STATUS.COMPLETED;

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}