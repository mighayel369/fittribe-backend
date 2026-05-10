import { inject, injectable } from "tsyringe";
import { IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { BookingMapper } from "application/mappers/booking-mapper";

@injectable()
export class FetchBookingDetailsForTrainer implements IFetchBookingDetails<TrainerBookingDetailsResponseDTO> {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo,

    @inject(I_CHAT_REPO_TOKEN)
    private readonly _chatRepository: IChatRepo
  ) { }

  async execute(bookingId: string): Promise<TrainerBookingDetailsResponseDTO> {
    const bookingRecord = await this._bookingRepository.findBookingDetails(bookingId);

    if (!bookingRecord) {
      throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    const chatRoom = await this._chatRepository.findChatRoom(
      bookingRecord.user.userId,
      bookingRecord.trainer.trainerId
    );

    const chatId = chatRoom ? chatRoom.chatId : null;

    return BookingMapper.toTrainerBookingDetailsResponse(bookingRecord, chatId);
  }
}