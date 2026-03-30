import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { BOOKING_STATUS } from "utils/Constants";
@injectable()
export class RejectRescheduleUseCase implements IProcessTrainerRescheduleUseCase {
  constructor(
    @inject("BookingRepo") private readonly _bookingRepo: IBookingRepo
  ) {}

  async execute(data: ProcessRescheduleRequestDTO): Promise<void> {
    const { bookingId, performedBy, reason } = data;
    const booking = await this._bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);

    const wasPending = booking.status === BOOKING_STATUS.PENDING;

    booking.rejectReschedule(performedBy, reason, wasPending);

    await this._bookingRepo.updateBooking(bookingId, booking);
  }
}