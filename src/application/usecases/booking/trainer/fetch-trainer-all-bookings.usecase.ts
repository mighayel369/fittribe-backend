
import { inject, injectable } from "tsyringe";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerBookingsResponseDTO, FetchTrainerBookingsResponseSchema } from "application/dto/booking/trainer/fetch-trainer-bookings.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { fetchAllBookingQueryDTO } from "application/dto/booking/shared/fetch-all-bookings.request.dto";

@injectable()
export class FetchTrainerAllBookings
  implements
  IFetchAllBookingsUseCase<
    FetchAllTrainerBookingsResponseDTO
  > {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(request: fetchAllBookingQueryDTO): Promise<FetchAllTrainerBookingsResponseDTO> {

    const {
      currentPage,
      limit,
      filter
    } = request;


    const { data, totalCount } =
      await this._bookingRepository.findAllBookings(
        filter,
        currentPage,
        limit
      );

    const mappedData = data.map((booking) =>
      BookingMapper.toTrainerBookingResponse(booking)
    );

    return FetchTrainerBookingsResponseSchema.parse({
      data: mappedData,
      totalPages: Math.ceil(totalCount / limit),
      currentPage,
      totalCount
    });
  }
}