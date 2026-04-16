export const I_DECLINE_BOOKING_USE_CASE_TOKEN = Symbol("I_DECLINE_BOOKING_USE_CASE_TOKEN");

export interface IDeclineBookingUseCase {
  execute(bookingId: string,reason?:string): Promise<void>;
}