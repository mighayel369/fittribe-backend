import { inject, injectable } from "tsyringe";
import { OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentUsecase } from "../payment/verify-online-payment.usecase";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { BookingMapper } from "application/mappers/booking-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";
import { I_PAYMENT_SERVICE_TOKEN, IPaymentService } from "domain/services/IPaymentService";
import { IBookSessionWithTrainer } from "application/interfaces/booking/i-book-session-with-trainer.usecase";
import { BookingResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { timeToMin } from "utils/generateTimeSlots";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
@injectable()
export class OnlineBookingUseCase
    extends VerifyOnlinePaymentUsecase
    implements IBookSessionWithTrainer {

    constructor(
        @inject(I_PAYMENT_SERVICE_TOKEN) paymentService: IPaymentService,
        @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo,
        @inject(I_WALLET_REPO_TOKEN) private _walletRepo: IWalletRepo,
        @inject(I_NOTIFICATION_SERVICE_TOKEN) private _notificationService: INotificationService,
        @inject(I_NOTIFICATION_REPO_TOKEN) private _notificationRepo: INotificationRepo
    ) {
        super(paymentService);
    }

    async bookSessionWithTrainer(input: OnlineBookingRequestDTO): Promise<BookingResponseDTO> {

        const paymentData = BookingMapper.toPaymentVerificationDTO(input);
        await super.execute(paymentData);

        const bookingData = BookingMapper.toBookingDetailsDTO(input);
        const bookingDate = new Date(bookingData.date);

        const isBooked = await this._bookingRepo.checkAvailability(
            bookingData.trainerId,
            bookingDate,
            timeToMin(bookingData.time)
        );

        if (isBooked) throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);

        const bookingEntity = BookingMapper.toBookingEntity(bookingData);
        console.log('booking mapper', bookingEntity)
        let bookingSummary = await this._bookingRepo.createBooking(bookingEntity);
        if (!bookingSummary) {
            throw new AppError('Booking Creation Got Faled', HttpStatus.BAD_REQUEST)
        }
        await this._walletRepo.holdAmount(bookingEntity.trainer as string, bookingEntity.bookingId, bookingEntity.trainerEarning);
        await this._walletRepo.holdAmount(config.ADMIN, bookingEntity.bookingId, bookingEntity.adminCommission);
        const data = {
            message: `We've received your payment. Your trainer has been notified and will confirm your session shortly.`,
            title: 'Payment Confirmed',
            recipientId: bookingData.userId,
            senderId: "SYSTEM_SECURITY"
        };
        const notificationEntity = NotificationMapper.toCreateEntity(data);
        await this._notificationRepo.addNotification(notificationEntity)
        await this._notificationService.notifyUser(data.recipientId, NotificationMapper.toResponseDTO(notificationEntity))
        
        return BookingMapper.toUserBookingsResponseDTO(bookingSummary)
    }
}