import { injectable, inject } from "tsyringe";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { AdminBookingDetailsResponseDTO } from "application/dto/booking/admin/booking-details.dto";
import { I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BookingMapper } from "application/mappers/booking-mapper";

@injectable()
export class FetchAdminBookingDetailsUseCase
  implements IFetchBookingDetails<AdminBookingDetailsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(
    bookingId: string
  ): Promise<AdminBookingDetailsResponseDTO> {

    const booking =
      await this._bookingRepository.findBookingDetails(bookingId);

    if (!booking) {
      throw new AppError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return BookingMapper.toAdminBookingDetailsResponseDTO(booking);
  }
}