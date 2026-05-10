import { BookingSummaryDTO, OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";

export const I_BOOK_SESSION_WITH_TRAINER_TOKEN = Symbol("I_BOOK_SESSION_WITH_TRAINER_TOKEN");

export interface IBookSessionWithTrainer {
   bookSessionWithTrainer(input: OnlineBookingRequestDTO ): Promise<BookingSummaryDTO>;
}
