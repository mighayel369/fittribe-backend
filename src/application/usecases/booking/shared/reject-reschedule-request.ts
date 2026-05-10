import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class RejectRescheduleUseCase implements IProcessTrainerRescheduleUseCase {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(rejectionData: ProcessRescheduleRequestDTO): Promise<void> {
    const { bookingId, performedBy, reason } = rejectionData;

    if (!reason || reason.trim().length < 3) {
      throw new AppError(ERROR_MESSAGES.REASON_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const wasPendingBeforeReschedule = bookingRecord.isPending();

    bookingRecord.rejectReschedule(
      performedBy,
      reason,
      wasPendingBeforeReschedule
    );

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}