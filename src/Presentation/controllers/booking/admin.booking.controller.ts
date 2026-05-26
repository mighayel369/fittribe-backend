
import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IFetchAllBookingsUseCase, I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { HttpStatus } from "utils/HttpStatus";
import { I_ADMIN_BOOKING_DASHBOARD_METRICS, IFetchAdminBookingsMetrics } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";
import { IFetchBookingDetails, I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { AdminBookingDetailsResponseDTO } from "application/dto/booking/admin/booking-details.dto";
import { FetchAllBookingsResponseDTO } from "application/dto/booking/admin/admin-booking-list.dto";
import { BookingMetricsQueryDTO } from "application/dto/booking/admin/booking-dashboard.request.dto";
import { fetchAllBookingQueryDTO } from "application/dto/booking/shared/fetch-all-bookings.request.dto";


@injectable()
export class AdminBookingController {
    constructor(
        @inject(I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN)
        private readonly _fetchAllBookingsUseCase: IFetchAllBookingsUseCase<FetchAllBookingsResponseDTO>,

        @inject(I_ADMIN_BOOKING_DASHBOARD_METRICS)
        private readonly _fetchBookingMetricsUseCase: IFetchAdminBookingsMetrics,

        @inject(I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN)
        private readonly _fetchBookingDetailsUseCase: IFetchBookingDetails<AdminBookingDetailsResponseDTO>
    ) { }

    getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const query = req.query as unknown as fetchAllBookingQueryDTO

            const bookings = await this._fetchAllBookingsUseCase.execute(query);
      
            res.status(HttpStatus.OK).json({
                success: true,
                ...bookings
            });

        } catch (error) {
    
            next(error);
        }
    };

    getBookingMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { range } = req.query as unknown as BookingMetricsQueryDTO

            const metrics = await this._fetchBookingMetricsUseCase.execute(range);

            res.status(HttpStatus.OK).json({
                success: true,
                ...metrics
            });

        } catch (err) {
            next(err);
        }
    }

    getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            const booking = await this._fetchBookingDetailsUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: booking
            });
        } catch (err) {
            next(err);
        }
    }
}