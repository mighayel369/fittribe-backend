
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
        @inject(I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN) private _fetchAllBookings: IFetchAllBookingsUseCase<FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO>,
        @inject(I_ADMIN_BOOKING_DASHBOARD_METRICS) private _fetchBookingMetrics: IFetchAdminBookingsMetrics,
        @inject(I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN) private _fetchBookingDetails: IFetchBookingDetails<AdminBookingDetailsResponseDTO>
    ) { }
    getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const payload = {
                searchQuery: (req.query.search as string) || "",
                currentPage: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                filter: {}
            };

            const result: FetchAllBookingsListResponseDTO = await this._fetchAllBookings.execute(payload);

            res.status(HttpStatus.OK).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error)
        }
    }

    getBookingMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const range = (req.query.range as '7days' | '6months') || '7days';
            const data:FetchAdminBookingDashboardResponseDTO = await this._fetchBookingMetrics.execute(range);

            res.status(200).json({
                success: true,
                ...data
            });
        } catch (err) {
            next(err);
        }
    }

    getBookingDetails = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            let bookingId=req.params.bookingId

            if(!bookingId) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA,HttpStatus.BAD_REQUEST)
           let result:AdminBookingDetailsResponseDTO=await this._fetchBookingDetails.execute(bookingId)
           res.status(HttpStatus.OK).json({
            success:true,
            data:result
           })
        } catch (err) {
            next(err);
        }
    }
}