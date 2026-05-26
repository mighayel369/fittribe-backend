import { FetchAdminBookingDashboardResponseDTO } from "application/dto/booking/admin/booking-dashboard.response.dto"

export const I_ADMIN_BOOKING_DASHBOARD_METRICS=Symbol("I_ADMIN_BOOKING_DASHBOARD_METRICS")

export interface IFetchAdminBookingsMetrics{
    execute(range:string):Promise<FetchAdminBookingDashboardResponseDTO>
}