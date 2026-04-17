import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_USER_ALL_BOOKINGS_TOKEN, IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { BookingResponseDTO, FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from 'application/dto/booking/fetch-all-bookings.dto';
import { I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/fetch-booking-details.dto';
import { I_BOOK_SESSION_WITH_TRAINER_TOKEN, IBookSessionWithTrainer } from 'application/interfaces/booking/i-book-session-with-trainer.usecase';
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { I_REQUEST_BOOKING_RESCHEDULE_TOKEN, IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { I_CANCEL_BOOKING_TOKEN, ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { OnlineBookingRequestDTO } from 'application/dto/booking/book-trainer.dto.';
import { I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, I_DECLINE_RESCHEDULE_REQUEST_TOKEN, IProcessTrainerRescheduleUseCase } from 'application/interfaces/booking/i-process-trainer-reschedule.usecase';
import { UserRole } from 'utils/Constants';
import { ProcessRescheduleRequestDTO } from 'application/dto/booking/process-reschedule.dto';
import { BookingParams } from 'Presentation/interfaces/request.params';
@injectable()
export class UserBookingController {
    constructor(
        @inject(I_BOOK_SESSION_WITH_TRAINER_TOKEN) private _finalizeBooking: IBookSessionWithTrainer,
        @inject(I_FETCH_USER_ALL_BOOKINGS_TOKEN) private _fetchBookings: IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO>,
        @inject(I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN) private _getDetails: IFetchBookingDetails<UserBookingDetailsResponseDTO>,
        @inject(I_REQUEST_BOOKING_RESCHEDULE_TOKEN) private _requestReschedule: IRequestBookingRescheduleUseCase,
        @inject(I_CANCEL_BOOKING_TOKEN) private _cancelBooking: ICancelBooking,
        @inject(I_ACCEPT_RESCHEDULE_REQUEST_TOKEN) private _acceptReschedule: IProcessTrainerRescheduleUseCase,
        @inject(I_DECLINE_RESCHEDULE_REQUEST_TOKEN) private _declineReschedule: IProcessTrainerRescheduleUseCase,

    ) { }

    checkoutAndBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const input: OnlineBookingRequestDTO = {
                ...req.body,
                userId: id
            };
            console.log(input)
            const bookingSummary: BookingResponseDTO = await this._finalizeBooking.bookSessionWithTrainer(input);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_SUCCESSFULL,
                bookingSummary
            });
        } catch (error) {
            next(error);
        }
    };


    requestReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { newDate, newTimeSlot, bookingId } = req.body;

            if (!id) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            let input: RescheduleRequestDTO = {
                bookingId,
                newDate,
                newTimeSlot
            }
            await this._requestReschedule.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
            });
        } catch (error: any) {
            next(error);
        }
    }

    cancelSession = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user as { id: string };
            if (!userId) throw new AppError("Unauthorized", 401);

            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND)
            }
            await this._cancelBooking.execute(bookingId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_CANCELLED
            });
            return
        } catch (err: any) {
            next(err);
        }
    }



    getBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };

            if (!id) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const filterType = (req.query.filter as string) || "all";

            const input: FetchAllUserBookingRequestDTO = {
                userId: id,
                limit: 5,
                currentPage: Number(req.query.pageNo) || 1,
                searchQuery: (req.query.search as string) || "",
                filter: { filterType }
            };

            const result = await this._fetchBookings.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.USER_BOOKINGS,
                bookingData: result.data,
                totalPages: result.total
            });
        } catch (err) {
            next(err);
        }
    };
    getBookingDetails = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND)
            }
            const booking: UserBookingDetailsResponseDTO = await this._getDetails.execute(bookingId);

            if (!booking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return
            }

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: booking
            });
            return
        } catch (err) {
            next(err);
        }
    }
    acceptReschedule = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;


            const { role: performedBy } = req.user as { role: UserRole };

            if (!bookingId || !performedBy) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._acceptReschedule.execute({
                bookingId,
                performedBy
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reschedule request accepted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    declineReschedule = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            const bookingId = req.params.bookingId
            const { role: performedBy } = req.user as { role: UserRole };
            if (!bookingId || !performedBy) {
                throw new AppError("Booking ID and reason are required", HttpStatus.BAD_REQUEST);
            }
            let input: ProcessRescheduleRequestDTO = {
                bookingId,
                performedBy,
            }

            console.log('input data =>', input)

            await this._declineReschedule.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reschedule request declined",
            });
        } catch (error) {
            next(error);
        }
    }

}