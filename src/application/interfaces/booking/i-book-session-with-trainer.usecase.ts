import { BookingSummaryDTO } from "application/dto/booking/shared/booking-summary.response.dto";
import { OnlineBookingRequestBodyDTO } from "application/dto/booking/shared/book-trainer.request.dto";
export const I_BOOK_SESSION_WITH_TRAINER_TOKEN = Symbol("I_BOOK_SESSION_WITH_TRAINER_TOKEN");

export interface IBookSessionWithTrainer {
   bookSessionWithTrainer(input: OnlineBookingRequestBodyDTO, ownerId: string): Promise<BookingSummaryDTO>;
}
