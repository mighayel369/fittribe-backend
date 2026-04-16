
import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { BookingMapper } from "application/mappers/booking-mapper";


@injectable()
export class FetchUserAllBookings implements IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO> {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN) private readonly bookingRepo: IBookingRepo
  ) {}

  async execute(input: FetchAllUserBookingRequestDTO): Promise<FetchAllUserBookingsResponseDTO> {
    const { userId, searchQuery, currentPage, limit, filter } = input;
    
    const repositoryFilters = { 
      user: userId, 
      ...filter 
    };

    const { data, totalCount } = await this.bookingRepo.findBookings(
      searchQuery,
      repositoryFilters,
      currentPage,
      limit
    );

    return {
      data: data.map(entity => BookingMapper.toUserBookingsResponseDTO(entity)),
      total: Math.ceil(totalCount / limit)
    };
  }
}