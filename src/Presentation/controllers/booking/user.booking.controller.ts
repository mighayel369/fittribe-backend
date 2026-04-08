import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { BookingResponseDTO, FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from 'application/dto/booking/fetch-all-bookings.dto';
import { IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { UserBookingDetailsResponseDTO } from 'application/dto/booking/fetch-booking-details.dto';
import { IBookSessionWithTrainer } from 'application/interfaces/booking/i-book-session-with-trainer.usecase';
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { ICancelBooking } from 'application/interfaces/booking/i-cancel-booking.usecase';
import { OnlineBookingRequestDTO } from 'application/dto/booking/book-trainer.dto.';
import { IProcessTrainerRescheduleUseCase } from 'application/interfaces/booking/i-process-trainer-reschedule.usecase';
import { UserRole } from 'utils/Constants';
import { ProcessRescheduleRequestDTO } from 'application/dto/booking/process-reschedule.dto';
@injectable()
export class UserBookingController {
    constructor(
        @inject("IBookSessionWithTrainer") private _finalizeBooking: IBookSessionWithTrainer,
        @inject("FetchUserBookingUseCase") private _fetchBookings: IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO>,
        @inject("FetchBookingDetails") private _getDetails: IFetchBookingDetails<UserBookingDetailsResponseDTO>,
        @inject("RequestReschedule") private _requestReschedule: IRequestBookingRescheduleUseCase,
        @inject("CancelUserBookingUseCase") private _cancelBooking: ICancelBooking,
        @inject("AcceptRescheduleBookingRequest") private _acceptReschedule: IProcessTrainerRescheduleUseCase,
        @inject("DeclineRescheduleBookingRequest") private _declineReschedule: IProcessTrainerRescheduleUseCase,

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

    cancelSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user as { id: string };
            if (!userId) throw new AppError("Unauthorized", 401);

            const { bookingId } = req.params;
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
    getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const booking: UserBookingDetailsResponseDTO = await this._getDetails.execute(id);

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
    acceptReschedule = async (req: Request, res: Response, next: NextFunction) => {
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

    declineReschedule = async (req: Request, res: Response, next: NextFunction) => {
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