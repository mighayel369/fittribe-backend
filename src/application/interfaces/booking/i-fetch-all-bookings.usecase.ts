import { fetchAllBookingQueryDTO } from "application/dto/booking/shared/fetch-all-bookings.request.dto";

export const I_FETCH_USER_ALL_BOOKINGS_TOKEN = Symbol("I_FETCH_USER_ALL_BOOKINGS_TOKEN");
export const I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN = Symbol("I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN");
export const I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN = Symbol("I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN");
export const I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN = Symbol("I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN");

export const I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN = Symbol("I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN");

export interface IFetchAllBookingsUseCase<TresponseDTO> {
  execute(input: fetchAllBookingQueryDTO): Promise<TresponseDTO>;
}