import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_USER_ALL_BOOKINGS_TOKEN, IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { FetchAllUserBookingsResponseDTO } from 'application/dto/booking/user/fetch-user-bookings.dto';
import { I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { I_BOOK_SESSION_WITH_TRAINER_TOKEN, IBookSessionWithTrainer } from 'application/interfaces/booking/i-book-session-with-trainer.usecase';
import { RescheduleRequestDTO } from 'application/dto/booking/shared/reschedule-request.dto';
import { I_REQUEST_BOOKING_RESCHEDULE_TOKEN, IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { I_CANCEL_BOOKING_TOKEN, ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, I_DECLINE_RESCHEDULE_REQUEST_TOKEN, IProcessTrainerRescheduleUseCase } from 'application/interfaces/booking/i-process-trainer-reschedule.usecase';

import { ProcessRescheduleRequestDTO } from 'application/dto/booking/shared/process-reschedule.dto';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/user/booking-details.dto';
import { fetchAllBookingQueryDTO } from 'application/dto/booking/shared/fetch-all-bookings.request.dto';



@injectable()
export class UserBookingController {
    constructor(
        @inject(I_BOOK_SESSION_WITH_TRAINER_TOKEN)
        private readonly _finalizeBookingUseCase: IBookSessionWithTrainer,

        @inject(I_FETCH_USER_ALL_BOOKINGS_TOKEN)
        private readonly _fetchBookingsUseCase: IFetchAllBookingsUseCase<FetchAllUserBookingsResponseDTO>,

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


    checkoutAndBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }


            const bookingSummary = await this._finalizeBookingUseCase.bookSessionWithTrainer(req.body, userId);

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
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const reschedulePayload: RescheduleRequestDTO = req.body;
    
            await this._requestRescheduleUseCase.execute(reschedulePayload, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    cancelSession = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const bookingId = req.params.bookingId as string

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
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const query = req.query as unknown as fetchAllBookingQueryDTO

            query.filter = {
                ...query.filter,
                clientId: userId
            };
            const bookingsResult = await this._fetchBookingsUseCase.execute(
                query
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message:
                    SUCCESS_MESSAGES.BOOKING.USER_BOOKINGS,
                ...bookingsResult
            });
        } catch (err) {
            next(err);
        }
    };

    getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookingId = req.params.bookingId as string
            const bookingDetails = await this._getBookingDetailsUseCase.execute(
                bookingId
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: bookingDetails
            });
        } catch (err) {
            next(err);
        }
    }

    acceptReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const bookingId = req.params.bookingId as string


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

    declineReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const bookingId = req.params.bookingId as string

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