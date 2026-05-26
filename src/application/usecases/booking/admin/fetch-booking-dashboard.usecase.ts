import { inject, injectable } from "tsyringe";
import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/admin/booking-dashboard.response.dto";
import { IFetchAdminBookingsMetrics } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchAdminBookingDashboardMetricsUseCase implements IFetchAdminBookingsMetrics {

  constructor(
    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(range: "7days" | "6months"): Promise<FetchAdminBookingDashboardResponseDTO> {

    const metrics = await this._bookingRepository.getAdminDashboardMetrics(range);

    if (!metrics) {
      throw new AppError(ERROR_MESSAGES.DASHBOARD_LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return BookingMapper.toAdminDashboardDTO(metrics);
  }
}