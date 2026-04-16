
export const I_CANCEL_BOOKING_TOKEN = Symbol("I_CANCEL_BOOKING_TOKEN");

export interface ICancelBooking{
    execute(bookingId:string):Promise<void>
}