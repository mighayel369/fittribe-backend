import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { BookingMapper } from "application/mappers/booking-mapper";

@injectable()
export class FetchAllBookingsAdmin
  implements IFetchAllBookingsUseCase<
    FetchAllBookingsListRequestDTO,
    FetchAllBookingsListResponseDTO
  > {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(query: FetchAllBookingsListRequestDTO): Promise<FetchAllBookingsListResponseDTO> {
    const { currentPage, limit, filter } = query;

    const criteria = {
      ...filter
    };

    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      criteria,
      currentPage,
      limit
    );

    const mappedData = data.map(booking => BookingMapper.toAdminBookingListResponse(booking));

    return {
      data: mappedData,
      total: Math.ceil(totalCount / limit),
    };
  }
}