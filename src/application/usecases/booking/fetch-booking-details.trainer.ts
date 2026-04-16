
import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { IChatRepo,I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
@injectable()
export class FetchBookingDetailsForTrainer implements IFetchBookingDetails<TrainerBookingDetailsResponseDTO> {
    constructor(
        @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
        @inject(I_CHAT_REPO_TOKEN) private _chatRepo: IChatRepo,
    ) {}

    async execute(bookingId: string): Promise<TrainerBookingDetailsResponseDTO> {
        const booking = await this._bookingRepo.findBookingById(bookingId);

        if (!booking) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        let chatId=await this._chatRepo.getChatId(booking.trainerId,booking.userId)

        return BookingMapper.toTrainerBookingDetailsDTO(booking,chatId);
    }
}