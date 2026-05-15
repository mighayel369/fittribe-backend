import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_USER_ALL_BOOKINGS_TOKEN, IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from 'application/dto/booking/fetch-all-bookings.dto';
import { I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/fetch-booking-details.dto';
import { I_BOOK_SESSION_WITH_TRAINER_TOKEN, IBookSessionWithTrainer } from 'application/interfaces/booking/i-book-session-with-trainer.usecase';
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { I_REQUEST_BOOKING_RESCHEDULE_TOKEN, IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { I_CANCEL_BOOKING_TOKEN, ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { BookingSummaryDTO, OnlineBookingRequestDTO } from 'application/dto/booking/book-trainer.dto.';
import { I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, I_DECLINE_RESCHEDULE_REQUEST_TOKEN, IProcessTrainerRescheduleUseCase } from 'application/interfaces/booking/i-process-trainer-reschedule.usecase';
import { BOOKING_TYPES } from 'utils/Constants';
import { ProcessRescheduleRequestDTO } from 'application/dto/booking/process-reschedule.dto';
import { BookingParams } from 'Presentation/interfaces/request.params';

@injectable()
export class UserBookingController {
    constructor(
        @inject(I_BOOK_SESSION_WITH_TRAINER_TOKEN)
        private readonly _finalizeBookingUseCase: IBookSessionWithTrainer,

        @inject(I_FETCH_USER_ALL_BOOKINGS_TOKEN)
        private readonly _fetchBookingsUseCase: IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO>,

        @inject(I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN)
        private readonly _getBookingDetailsUseCase: IFetchBookingDetails<UserBookingDetailsResponseDTO>,

        @inject(I_REQUEST_BOOKING_RESCHEDULE_TOKEN)
        private readonly _requestRescheduleUseCase: IRequestBookingRescheduleUseCase,

        @inject(I_CANCEL_BOOKING_TOKEN)
        private readonly _cancelBookingUseCase: ICancelBooking,

        @inject(I_ACCEPT_RESCHEDULE_REQUEST_TOKEN)
        private readonly _acceptRescheduleUseCase: IProcessTrainerRescheduleUseCase,

        @inject(I_DECLINE_RESCHEDULE_REQUEST_TOKEN)
        private readonly _declineRescheduleUseCase: IProcessTrainerRescheduleUseCase,
    ) { }

    private isValidBookingType = (value: unknown): value is BOOKING_TYPES => {
        return Object.values(BOOKING_TYPES).includes(value as BOOKING_TYPES);
    };



    checkoutAndBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }
            const bookingPayload: OnlineBookingRequestDTO = {
                ...req.body,
                userId
            };

            const bookingSummary: BookingSummaryDTO =
                await this._finalizeBookingUseCase.bookSessionWithTrainer(bookingPayload);

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
            const reschedulePayload: RescheduleRequestDTO = req.body;

            await this._requestRescheduleUseCase.execute(reschedulePayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
            });
        } catch (error: unknown) {

            next(error);
        }
    }

    cancelSession = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {

            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            await this._cancelBookingUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_CANCELLED
            });
        } catch (err: unknown) {
            next(err);
        }
    }

    getBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;
            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
            }

            const rawSearch = req.query.search;
            const search = typeof rawSearch === 'string' ? rawSearch : "";

            const rawFilter = req.query.filter;
            const filterType = this.isValidBookingType(rawFilter) ? rawFilter : BOOKING_TYPES.ALL;

            const dateQuery = req.query.date;

            const validatedDate = typeof dateQuery === 'string' ? new Date(dateQuery) : new Date();

            const fetchPayload: FetchAllUserBookingRequestDTO = {
                userId,
                limit: 5,
                currentPage: Number(req.query.pageNo) || 1,
                filter: {
                    search: search || "",
                    filterType: filterType,
                    date: validatedDate
                }
            };

            const bookingsResult = await this._fetchBookingsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.USER_BOOKINGS,
                bookingData: bookingsResult.data,
                totalPages: bookingsResult.total
            });
        } catch (err) {
            next(err);
        }
    };

    getBookingDetails = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const bookingDetails: UserBookingDetailsResponseDTO =
                await this._getBookingDetailsUseCase.execute(bookingId);

            if (!bookingDetails) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: ERROR_MESSAGES.BOOKING_NOT_FOUND
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: bookingDetails
            });
        } catch (err) {

            next(err);
        }
    }

    acceptReschedule = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { bookingId } = req.params;


            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._acceptRescheduleUseCase.execute({
                bookingId,
                performedBy
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_BOOKING_ACCEPTED,
            });
        } catch (error) {
            next(error);
        }
    }

    declineReschedule = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const processPayload: ProcessRescheduleRequestDTO = {
                bookingId,
                performedBy,
            };

            await this._declineRescheduleUseCase.execute(processPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_BOOKING_REQUEST_DECLINED,
            });
        } catch (error) {
            next(error);
        }
    }
}