export const I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN = Symbol("I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN");
export const I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN = Symbol("I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN");
export const I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN = Symbol("I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN");
export interface IFetchBookingDetails<bookingResponseDTO>{
    execute(bookingId:string):Promise<bookingResponseDTO>
}