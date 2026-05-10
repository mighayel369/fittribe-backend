import { inject, injectable } from "tsyringe";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import {
  FetchAllTrainerBookingRequestDTO,
  FetchAllTrainerPendingBookingsResponseDTO
} from "application/dto/booking/fetch-all-bookings.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { BookingMapper } from "application/mappers/booking-mapper";
@injectable()
export class FetchTrainerAllPendingBookings implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerPendingBookingsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(query: FetchAllTrainerBookingRequestDTO): Promise<FetchAllTrainerPendingBookingsResponseDTO> {
    const { trainerId, currentPage, limit, filter } = query;

    const searchFilters = {
      filter,
      trainer: trainerId,
      status: BOOKING_STATUS.PENDING
    };

    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      searchFilters,
      currentPage,
      limit
    );

    const mappedData = data.map(booking => BookingMapper.toTrainerPendingBookingResponse(booking));

    return {
      data: mappedData,
      total: Math.ceil(totalCount / limit),
    };
  }
}