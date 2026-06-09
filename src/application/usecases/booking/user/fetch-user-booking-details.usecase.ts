import { inject, injectable } from "tsyringe";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { UserBookingDetailsResponseDTO } from "application/dto/booking/user/booking-details.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";

@injectable()
export class FetchBookingDetailsForClient
  implements
  IFetchBookingDetails<UserBookingDetailsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(
    bookingId: string
  ): Promise<UserBookingDetailsResponseDTO> {

    if (!bookingId) {
      throw new AppError(
        ERROR_MESSAGES.MISSING_REQUIRED_DATA,
        HttpStatus.BAD_REQUEST
      );
    }

    const bookingRecord =
      await this._bookingRepository.findBookingDetails(
        bookingId
      );

    if (!bookingRecord) {
      throw new AppError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }


    const chatRoom = await this._chatRepository.findChatRoom(
      bookingRecord.user.userId,
      bookingRecord.trainer.trainerId
    );

    const chatId = chatRoom?.chatId || null;

    return BookingMapper.toUserBookingDetailsResponse(
      bookingRecord,
      chatId
    );
  }
}