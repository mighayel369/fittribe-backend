import { OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { BookingResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";

export const I_BOOK_SESSION_WITH_TRAINER_TOKEN = Symbol("I_BOOK_SESSION_WITH_TRAINER_TOKEN");

export interface IBookSessionWithTrainer {
   bookSessionWithTrainer(input: OnlineBookingRequestDTO ): Promise<BookingResponseDTO>;
}
