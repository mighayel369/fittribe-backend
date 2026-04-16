// application/usecases/FetchAllBookingsAdmin.ts

import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import {
  FetchAllBookingsListRequestDTO,
  FetchAllBookingsListResponseDTO
} from "application/dto/booking/fetch-all-bookings.dto";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";

@injectable()
export class FetchAllBookingsAdmin implements IFetchAllBookingsUseCase<FetchAllBookingsListRequestDTO,FetchAllBookingsListResponseDTO>{
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepo: IBookingRepo
  ) { }

  async execute(input: FetchAllBookingsListRequestDTO): Promise<FetchAllBookingsListResponseDTO> {
    const { searchQuery, currentPage, limit, filter } = input;

    const { data, totalCount } = await this._bookingRepo.findBookings(
      searchQuery,
      filter,
      currentPage,
      limit
    );

    return {
      data: data.map(booking => BookingMapper.toAdminBookingsResponseDTO(booking)),
      total: totalCount
    };
  }
}