import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";

import { BookingMapper } from "application/mappers/booking-mapper";
import { IBookingFilters } from "domain/filters/IBookingFilters";

@injectable()
export class FetchTrainerAllBookings implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(query: FetchAllTrainerBookingRequestDTO): Promise<FetchAllTrainerBookingsResponseDTO> {
    const { trainerId, currentPage, limit, filter } = query;


    const criteria: IBookingFilters = {
      ...filter,
      trainerId
    };

    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      criteria,
      currentPage,
      limit
    );

    const mappedData = data.map(booking => BookingMapper.toTrainerBookingResponse(booking));

    return {
      data: mappedData,
      total: Math.ceil(totalCount / limit),
    };
  }
}