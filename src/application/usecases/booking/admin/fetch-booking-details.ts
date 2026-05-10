import { inject, injectable } from "tsyringe";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { AdminBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class FetchAdminBookingDetails implements IFetchBookingDetails<AdminBookingDetailsResponseDTO> {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(bookingId: string): Promise<AdminBookingDetailsResponseDTO> {
    if (!bookingId) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const bookingRecord = await this._bookingRepository.findBookingDetails(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND || ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return BookingMapper.toAdminBookingDetailsResponse(bookingRecord);
  }
}