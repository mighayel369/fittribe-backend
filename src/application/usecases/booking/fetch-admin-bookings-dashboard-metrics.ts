import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { IFetchAdminBookingsMetrics } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";
import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
@injectable()
export class FetchAdminBookingDashboardMetrics implements IFetchAdminBookingsMetrics {
    constructor(
        @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepo: IBookingRepo
    ) { }

    async execute(range: '7days' | '6months'): Promise<FetchAdminBookingDashboardResponseDTO> {
        const domainData = await this._bookingRepo.getAdminDashboardMetrics(range);
        
        return {
            stats: domainData.stats,
            charts: {
                bookingTrend: domainData.trends, 
                statusDistribution: domainData.distribution
            }
        };
    }
}