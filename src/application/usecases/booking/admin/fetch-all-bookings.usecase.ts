
import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllBookingsResponseDTO, FetchAllBookingsResponseSchema } from "application/dto/booking/admin/admin-booking-list.dto";
import { BookingMapper } from "application/mappers/booking-mapper";
import { fetchAllBookingQueryDTO } from "application/dto/booking/shared/fetch-all-bookings.request.dto";

@injectable()
export class FetchAllBookingsAdminUseCase implements IFetchAllBookingsUseCase<FetchAllBookingsResponseDTO> {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(request: fetchAllBookingQueryDTO): Promise<FetchAllBookingsResponseDTO> {

    const { currentPage, limit, filter } = request;
    const { data, totalCount } = await this._bookingRepository.findAllBookings(filter, currentPage, limit);

    const mappedBookings = data.map((booking) =>
      BookingMapper.toAdminBookingListItemDTO(booking)
    );

    return FetchAllBookingsResponseSchema.parse({
      data: mappedBookings,
      totalPages: Math.ceil(totalCount / limit),
      currentPage,
      totalCount
    });
  }
}