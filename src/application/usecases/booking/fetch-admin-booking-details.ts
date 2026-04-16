import { AdminBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BookingMapper } from "application/mappers/booking-mapper";
@injectable()
export class FetchAdminBookingDetails implements IFetchBookingDetails<AdminBookingDetailsResponseDTO> {
    constructor(
        @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepo: IBookingRepo
    ) { }

    async execute(bookingId: string): Promise<AdminBookingDetailsResponseDTO> {
        const booking = await this._bookingRepo.findBookingById(bookingId);

        if (!booking) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return BookingMapper.toAdminBookingResponseDTO(booking);
    }
}