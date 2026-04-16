import { IMarkAsComplete } from "application/interfaces/booking/i-mark-as-complete";
import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { BOOKING_STATUS } from "utils/Constants";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class MarkAsComplete implements IMarkAsComplete {
    constructor(@inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo) { }
    async execute(bookingId: string): Promise<void> {
        let bookingEntity = await this._bookingRepo.findBookingById(bookingId)
        if (!bookingEntity) throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND)
        bookingEntity.status = BOOKING_STATUS.COMPLETED
        await this._bookingRepo.updateBooking(bookingId, bookingEntity)
    }
}