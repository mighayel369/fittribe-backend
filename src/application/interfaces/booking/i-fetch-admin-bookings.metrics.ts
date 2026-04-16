import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";

export const I_ADMIN_BOOKING_DASHBOARD_METRICS=Symbol("I_ADMIN_BOOKING_DASHBOARD_METRICS")

export interface IFetchAdminBookingsMetrics{
    execute(range:string):Promise<FetchAdminBookingDashboardResponseDTO>
}