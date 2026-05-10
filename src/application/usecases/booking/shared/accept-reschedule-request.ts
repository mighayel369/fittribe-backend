import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { UserRole } from "domain/constants/user-role";
import config from "config";

@injectable()
export class AcceptRescheduleBookingRequest implements IProcessTrainerRescheduleUseCase {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo
  ) { }

  async execute(rescheduleData: ProcessRescheduleRequestDTO): Promise<void> {
    const { bookingId, performedBy } = rescheduleData;

    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isPendingHandshake = bookingRecord.isPending();
    bookingRecord.approveReschedule(performedBy);
    if (isPendingHandshake && performedBy === UserRole.USER) {
      await this._walletRepository.convertHoldToBalance(
        bookingRecord.trainerId,
        bookingId
      );

      await this._walletRepository.convertHoldToBalance(
        config.ADMIN,
        bookingId
      );
    }

    await this._bookingRepository.updateBooking(bookingId, bookingRecord);
  }
}