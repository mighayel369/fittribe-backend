import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN, I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN, I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN, IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { IFetchBookingDetails, I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO, FetchAllTrainerPendingBookingsResponseDTO, FetchAllTrainerRescheduleBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IConfirmBookingUseCase, I_CONFIRM_BOOKING_USE_CASE_TOKEN } from "application/interfaces/booking/i-confirm-booking.usecase";
import { IDeclineBookingUseCase, I_DECLINE_BOOKING_USE_CASE_TOKEN } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, I_DECLINE_RESCHEDULE_REQUEST_TOKEN, IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { I_TRAINER_RESCHEDULE_BOOKING_TOKEN, IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { PAGINATION } from 'utils/Constants';
import { UserRole } from 'domain/constants/user-role';
import { I_GET_MEET_LINK_TOKEN, IGetMeetLink } from 'application/interfaces/booking/i-get-meetlink.usecase';
import { I_MARK_AS_COMPLETE_TOKEN, IMarkAsComplete } from 'application/interfaces/booking/i-mark-as-complete';
import { BookingParams } from 'Presentation/interfaces/request.params';

@injectable()
export class TrainerBookingController {
    constructor(
        @inject(I_CONFIRM_BOOKING_USE_CASE_TOKEN)
        private readonly _confirmBookingUseCase: IConfirmBookingUseCase,

        @inject(I_DECLINE_BOOKING_USE_CASE_TOKEN)
        private readonly _declineBookingUseCase: IDeclineBookingUseCase,

        @inject(I_ACCEPT_RESCHEDULE_REQUEST_TOKEN)
        private readonly _acceptRescheduleUseCase: IProcessTrainerRescheduleUseCase,

        @inject(I_DECLINE_RESCHEDULE_REQUEST_TOKEN)
        private readonly _declineRescheduleUseCase: IProcessTrainerRescheduleUseCase,

        @inject(I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN)
        private readonly _fetchAllBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO>,

        @inject(I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN)
        private readonly _fetchPendingBookingsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerPendingBookingsResponseDTO>,

        @inject(I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN)
        private readonly _fetchBookingDetailsUseCase: IFetchBookingDetails<TrainerBookingDetailsResponseDTO>,

        @inject(I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN)
        private readonly _fetchRescheduleRequestsUseCase: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerRescheduleBookingsResponseDTO>,

        @inject(I_TRAINER_RESCHEDULE_BOOKING_TOKEN)
        private readonly _requestRescheduleUseCase: IRequestBookingRescheduleUseCase,

        @inject(I_GET_MEET_LINK_TOKEN)
        private readonly _getMeetLinkUseCase: IGetMeetLink,

        @inject(I_MARK_AS_COMPLETE_TOKEN)
        private readonly _markAsCompleteUseCase: IMarkAsComplete
    ) { }


    acceptBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.body;
            await this._confirmBookingUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.TRAINER_BOOKING_SUCCESSFULL,
            });
        } catch (error) {
            next(error);
        }
    };

    rejectBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId, reason } = req.body;
            await this._declineBookingUseCase.execute(bookingId, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.TRAINER_DECLINED_BOOKING
            });
        } catch (error) {
            next(error);
        }
    };

    approveReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.body;
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }


            if (typeof bookingId !== 'string' || !bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._acceptRescheduleUseCase.execute({
                bookingId,
                performedBy: performedBy as UserRole
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reschedule request accepted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    rejectReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId, reason } = req.body;
            const performedBy = req.user?.user.role;

            if (!performedBy) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }


            const processReschedulePayload: ProcessRescheduleRequestDTO = {
                bookingId,
                performedBy: performedBy,
                reason
            };

            await this._declineRescheduleUseCase.execute(processReschedulePayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_BOOKING_REQUEST_DECLINED,
            });
        } catch (error) {
            next(error);
        }
    };


    rescheduleByTrainer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainer = req.user;

            if (!trainer || typeof trainer !== 'object' || !('id' in trainer) || typeof trainer.id !== 'string') {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const trainerId = trainer.id;
            const reschedulePayload: RescheduleRequestDTO = {
                ...req.body,
                trainerId
            }
            await this._requestRescheduleUseCase.execute(reschedulePayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }


            const rawSearch = req.query.search;
            const search = typeof rawSearch === 'string' ? rawSearch : "";
            const fetchPayload: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                filter: {
                    search: search || ""
                }
            };

            const bookingsHistory = await this._fetchAllBookingsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKINGS_FETCHED,
                ...bookingsHistory
            });
        } catch (err) {
            next(err);
        }
    };

    getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }


            const rawSearch = req.query.search;
            const search = typeof rawSearch === 'string' ? rawSearch : "";

            const fetchPayload: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                filter: {
                    search: search || ""
                }
            };

            const pendingBookings = await this._fetchPendingBookingsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_PENDING_FETCHED,
                ...pendingBookings
            });
        } catch (err) {
            next(err);
        }
    };

    getRescheduleRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.user.id;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const rawSearch = req.query.search;
            const search = typeof rawSearch === 'string' ? rawSearch : "";
            const fetchPayload: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                filter: {
                    search: search || ""
                }
            };

            const rescheduleRequests = await this._fetchRescheduleRequestsUseCase.execute(fetchPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                ...rescheduleRequests
            });
        } catch (err) {
            next(err);
        }
    };

    getBookingDetails = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const bookingDetails = await this._fetchBookingDetailsUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: bookingDetails
            });
        } catch (error) {
            next(error);
        }
    };

    getMeetLink = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.BAD_REQUEST);
            }

            const meetLink = await this._getMeetLinkUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: meetLink
            });
        } catch (err) {
            next(err);
        }
    }

    markAsComplete = async (req: Request<BookingParams>, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.BAD_REQUEST);
            }

            await this._markAsCompleteUseCase.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.MARKED_AS_COMPLETED,
            });
        } catch (err) {
            next(err);
        }
    }
}