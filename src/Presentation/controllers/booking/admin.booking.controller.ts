
import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IFetchAllBookingsUseCase, I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { HttpStatus } from "utils/HttpStatus";
import { FetchAdminBookingDashboardResponseDTO, FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { PAGINATION } from "utils/Constants";
import { I_ADMIN_BOOKING_DASHBOARD_METRICS, IFetchAdminBookingsMetrics } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";
import { IFetchBookingDetails, I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { AdminBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { BookingParams } from "Presentation/interfaces/request.params";


@injectable()
export class AdminBookingController {
    constructor(
        @inject(I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN)
        private readonly _fetchAllBookingsUseCase: IFetchAllBookingsUseCase<FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO>,

        @inject(I_ADMIN_BOOKING_DASHBOARD_METRICS)
        private readonly _fetchBookingMetricsUseCase: IFetchAdminBookingsMetrics,

        @inject(I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN)
        private readonly _fetchBookingDetailsUseCase: IFetchBookingDetails<AdminBookingDetailsResponseDTO>
    ) { }

    getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawSearch = req.query.search;
            const search = typeof rawSearch === 'string' ? rawSearch : "";
            const dateQuery = req.query.date;

            const validatedDate = typeof dateQuery === 'string' ? new Date(dateQuery) : new Date();
            const fetchBookingsPayload: FetchAllBookingsListRequestDTO = {
                currentPage: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                filter: {
                    search: search || "",
                    date:validatedDate
                }
            }

            const bookingsResult = await this._fetchAllBookingsUseCase.execute(fetchBookingsPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                ...bookingsResult
            });
        } catch (error) {
            next(error);
        }
    }

    getBookingMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timeRange = (req.query.range as '7days' | '6months') || '7days';

            const metricsData: FetchAdminBookingDashboardResponseDTO =
                await this._fetchBookingMetricsUseCase.execute(timeRange);

            res.status(HttpStatus.OK).json({
                success: true,
                ...metricsData
            });
        } catch (err) {
            next(err);
        }
    }

    getBookingDetails = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const bookingDetails: AdminBookingDetailsResponseDTO =
                await this._fetchBookingDetailsUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: bookingDetails
            });
        } catch (err) {
            next(err);
        }
    }
}