export const I_CONFIRM_BOOKING_USE_CASE_TOKEN = Symbol("I_CONFIRM_BOOKING_USE_CASE_TOKEN");

export interface IConfirmBookingUseCase {
  execute(bookingId: string): Promise<void>;
}