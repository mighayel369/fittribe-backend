import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { BOOKING_STATUS ,UserRole} from "utils/Constants";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import config from "config";@injectable()
@injectable()
export class AcceptRescheduleBookingRequest implements IProcessTrainerRescheduleUseCase {
  constructor(
    @inject("BookingRepo") private readonly _bookingRepo: IBookingRepo,
    @inject("WalletRepo") private readonly _walletRepo: IWalletRepo
  ) {}

  async execute(data: ProcessRescheduleRequestDTO): Promise<void> {
    const { bookingId, performedBy } = data;
    const booking = await this._bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);

    const isPendingHandshake = booking.status === BOOKING_STATUS.PENDING;

    booking.approveReschedule(performedBy);

    if (isPendingHandshake && performedBy === UserRole.USER) {
       await this._walletRepo.convertHoldToBalance(booking.trainerId, bookingId);
       await this._walletRepo.convertHoldToBalance(config.ADMIN_WALLET, bookingId);
    }

    await this._bookingRepo.updateBooking(bookingId, booking);
  }
}