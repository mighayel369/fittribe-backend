import { inject, injectable } from "tsyringe";
import { IFetchAdminBookingsMetrics } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";
import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { BookingMapper } from "application/mappers/booking-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class FetchAdminBookingDashboardMetrics implements IFetchAdminBookingsMetrics {
  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(range: '7days' | '6months'): Promise<FetchAdminBookingDashboardResponseDTO> {
    const domainMetrics = await this._bookingRepository.getAdminDashboardMetrics(range);

    if (!domainMetrics) {
      throw new AppError(ERROR_MESSAGES.DASHBOARD_LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return BookingMapper.toAdminDashboardDTO(domainMetrics);
  }
}