import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IFetchAllBookingsUseCase } from 'application/interfaces/booking/i-fetch-all-bookings.usecase';
import { IFetchBookingDetails } from 'application/interfaces/booking/i-fetch-booking-details.usecase';
import { FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO, FetchAllTrainerPendingBookingsResponseDTO, FetchAllTrainerRescheduleBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { TrainerBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { ProcessRescheduleRequestDTO } from "application/dto/booking/process-reschedule.dto";
import { IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { RescheduleRequestDTO } from 'application/dto/booking/reschedule-request.dto';
import { IRequestBookingRescheduleUseCase } from 'application/interfaces/booking/i-request-booking-reschedule.usecase';
import { PAGINATION, UserRole } from 'utils/Constants';
import { IGetMeetLink } from 'application/interfaces/booking/i-get-meetlink.usecase';
@injectable()
export class TrainerBookingController {
    constructor(
        @inject("TrainerAcceptBookingUseCase") private _confirm: IConfirmBookingUseCase,
        @inject("TrainerRejectBookingUseCase") private _decline: IDeclineBookingUseCase,
        @inject("AcceptRescheduleBookingRequest") private _acceptReschedule: IProcessTrainerRescheduleUseCase,
        @inject("DeclineRescheduleBookingRequest") private _declineReschedule: IProcessTrainerRescheduleUseCase,
        @inject("FetchTrainerAllBookingUseCase") private _fetchAll: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO>,
        @inject("FetchTrainerPendingBookingUseCase") private _fetchPending: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerPendingBookingsResponseDTO>,
        @inject("FindTrainerBookingDetails") private _findDetails: IFetchBookingDetails<TrainerBookingDetailsResponseDTO>,
        @inject("FetchTrainerRescheduleRequests") private _fetchReschedule: IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerRescheduleBookingsResponseDTO>,
        @inject("RescheduleBookingByTrainer") private _rescheduleBookingByTrainer: IRequestBookingRescheduleUseCase,
        @inject("IGetMeetLink") private _getmeetlink: IGetMeetLink

    ) { }

    acceptBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };
            const { bookingId } = req.body

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._confirm.execute(bookingId);

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
        // Logic is now safe: reason is guaranteed to be a valid string
        await this._decline.execute(bookingId, reason);

        res.status(HttpStatus.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.BOOKING.TRAINER_DECLINED_BOOKING
        });
    } catch (error) { next(error); }
};

    approveReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.body;
              const { role: performedBy } = req.user as { role: UserRole};
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
    };

    rejectReschedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            const { bookingId, reason } = req.body;
         const { role: performedBy } = req.user as { role: UserRole};
            if (!bookingId || !reason||!performedBy) {
                throw new AppError("Booking ID and reason are required", HttpStatus.BAD_REQUEST);
            }
            let input: ProcessRescheduleRequestDTO = {
                bookingId,
                performedBy,
                reason
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
    };

    rescheduleByTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await this._rescheduleBookingByTrainer.execute(req.body);

        res.status(HttpStatus.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.BOOKING.RESCHEDULE_REQUEST_INITIATED,
        });
    } catch (error) { next(error); }
};
    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as { id: string };
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const input: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                searchQuery: (req.query.search as string) || "",
                filter: {}
            };
            const result: FetchAllTrainerBookingsResponseDTO = await this._fetchAll.execute(input);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKINGS_FETCHED,
                ...result
            });
        } catch (err) { next(err); }
    };

    getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as any;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const input: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                searchQuery: (req.query.search as string) || "",
                filter: {}
            };
            const result: FetchAllTrainerPendingBookingsResponseDTO = await this._fetchPending.execute(input);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_PENDING_FETCHED,
                ...result
            });
        } catch (err) { next(err); }
    };

    getRescheduleRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: trainerId } = req.user as any;
            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }
            const input: FetchAllTrainerBookingRequestDTO = {
                trainerId,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(req.query.limit) ||PAGINATION.DEFAULT_LIMIT,
                searchQuery: (req.query.search as string) || "",
                filter: {}
            };
            const result: FetchAllTrainerRescheduleBookingsResponseDTO = await this._fetchReschedule.execute(input);
            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (err) { next(err); }
    };

    getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }
            const result: TrainerBookingDetailsResponseDTO = await this._findDetails.execute(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getMeetLink=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            let bookingId=req.params.id
            let meetLink=await this._getmeetlink.execute(bookingId)

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.BOOKING_DETAILS_FETCHED,
                data: meetLink
            })
        }catch(err){
            next(err)
        }
    }
}