import { inject, injectable } from "tsyringe";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import {
  FetchAllUserBookingsResponseDTO,
  FetchAllUserBookingsResponseSchema
} from "application/dto/booking/user/fetch-user-bookings.dto";
import {
  IBookingRepo,
  I_BOOKING_REPO_TOKEN
} from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { fetchAllBookingQueryDTO } from "application/dto/booking/shared/fetch-all-bookings.request.dto";

@injectable()
export class FetchUserAllBookings
  implements
  IFetchAllBookingsUseCase<
    FetchAllUserBookingsResponseDTO
  > {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(
    query: fetchAllBookingQueryDTO
  ): Promise<FetchAllUserBookingsResponseDTO> {

    const {
      currentPage,
      limit,
      filter
    } = query;


    const { data, totalCount } = await this._bookingRepository.findAllBookings(
      filter,
      currentPage,
      limit
    );

    const mappedData = data.map((booking) => BookingMapper.toUserBookingResponse(booking));

    return FetchAllUserBookingsResponseSchema.parse({
      data: mappedData,
      totalPages: Math.ceil(totalCount / limit),
      currentPage,
      totalCount
    });
  }
}