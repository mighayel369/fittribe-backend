import { inject, injectable } from "tsyringe";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import {
  FetchAllUserBookingRequestDTO,
  FetchAllUserBookingsResponseDTO
} from "application/dto/booking/fetch-all-bookings.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { IBookingFilters } from "domain/filters/IBookingFilters";

@injectable()
export class FetchUserAllBookings
  implements IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(query: FetchAllUserBookingRequestDTO): Promise<FetchAllUserBookingsResponseDTO> {

    const { userId, currentPage, limit, filter } = query;

    const criteria: IBookingFilters = {
      ...filter,
      clientId: userId
    };


    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      criteria,
      currentPage,
      limit
    );

    const mappedData = data.map(booking => BookingMapper.toUserBookingResponse(booking));

    return {
      data: mappedData,
      total: Math.ceil(totalCount / limit)
    };
  }
}