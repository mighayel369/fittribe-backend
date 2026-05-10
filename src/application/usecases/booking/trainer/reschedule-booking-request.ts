import { inject, injectable } from "tsyringe";
import { IRequestBookingRescheduleUseCase } from "application/interfaces/booking/i-request-booking-reschedule.usecase";
import { RescheduleRequestDTO } from "application/dto/booking/reschedule-request.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { UserRole } from "domain/constants/user-role";

@injectable()
export class RescheduleBookingByTrainer implements IRequestBookingRescheduleUseCase {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(rescheduleRequest: RescheduleRequestDTO): Promise<void> {
    const { bookingId, newDate, newTimeSlot, reason, trainerId } = rescheduleRequest;

    if (!reason || reason.trim().length < 3) {
      throw new AppError(ERROR_MESSAGES.REASON_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (bookingRecord.trainerId !== trainerId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    bookingRecord.requestReschedule(
      newDate,
      newTimeSlot,
      UserRole.TRAINER,
      reason
    );

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}