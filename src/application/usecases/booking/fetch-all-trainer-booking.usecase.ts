
import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerBookingRequestDTO,FetchAllTrainerBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
@injectable()
export class FetchTrainerAllBookings implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO> {
  constructor(@inject(I_BOOKING_REPO_TOKEN) private _repo: IBookingRepo) {}

  async execute(input: FetchAllTrainerBookingRequestDTO): Promise<FetchAllTrainerBookingsResponseDTO> {
    const { trainerId, searchQuery, currentPage, limit } = input;
    const { data, totalCount } = await this._repo.findBookings(searchQuery, { trainer: trainerId }, currentPage, limit);
    return { 
      data: data.map(d => BookingMapper.toTrainerBookingsResponseDTO(d)),
       total: totalCount
      };
  }
}