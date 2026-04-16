import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { IGetMeetLink } from "application/interfaces/booking/i-get-meetlink.usecase";

@injectable()
export class StartSessionUseCase implements IGetMeetLink {
  constructor(@inject(I_BOOKING_REPO_TOKEN) private bookingRepo: IBookingRepo) { }

  async execute(bookingId: string): Promise<string> {
    let bookingEntity = await this.bookingRepo.findBookingById(bookingId);

    if (!bookingEntity) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (bookingEntity.meetLink) {
      return bookingEntity.meetLink;
    }

    const sanitizedId = bookingId.replace(/-/g, '_');
    const roomName = `FitTribe_Session_${sanitizedId}_${Math.random().toString(36).substring(7)}`;
    const meetLink = `https://meet.jit.si/${roomName}`;

    bookingEntity.meetLink = meetLink;
    await this.bookingRepo.updateBooking(bookingId, bookingEntity);

    return meetLink;
  }
}