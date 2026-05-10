import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import {
  FetchAllTrainerBookingRequestDTO,
  FetchAllTrainerRescheduleBookingsResponseDTO
} from "application/dto/booking/fetch-all-bookings.dto";
import { BOOKING_STATUS } from "domain/constants/booking-status";
import { BookingMapper } from "application/mappers/booking-mapper";

@injectable()
export class FetchTrainerAllRescheduleBookings implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerRescheduleBookingsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(query: FetchAllTrainerBookingRequestDTO) {
    const { trainerId, currentPage, limit, filter } = query;

    const searchFilters = {
      filter,
      trainer: trainerId,
      status: BOOKING_STATUS.RESCHEDULE_REQUESTED
    };

    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      searchFilters,
      currentPage,
      limit
    );

    const mappedData = data.map(booking => BookingMapper.toTrainerRescheduleBookingResponse(booking));

    return {
      data: mappedData,
      total: Math.ceil(totalCount / limit),
    };
  }
}