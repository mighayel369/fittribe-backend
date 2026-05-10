
import { inject, injectable } from "tsyringe";
import { IGetMeetLink } from "application/interfaces/booking/i-get-meetlink.usecase";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IMeetingService, I_MEETING_SERVICE_TOKEN } from "domain/services/i-meeting-service";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class StartSessionUseCase implements IGetMeetLink {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_MEETING_SERVICE_TOKEN)
    private readonly _meetingService: IMeetingService
  ) { }

  async execute(bookingId: string): Promise<string> {
    const bookingRecord = await this._bookingRepository.findBookingById(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    if (bookingRecord.meetLink) {
      return bookingRecord.meetLink;
    }


    const generatedMeetLink = this._meetingService.generateLink(bookingId);


    bookingRecord.meetLink = generatedMeetLink;
    await this._bookingRepository.updateBooking(bookingId, bookingRecord);

    return generatedMeetLink;
  }
}