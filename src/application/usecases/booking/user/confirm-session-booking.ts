import { inject, injectable } from "tsyringe";
import { BookingSummaryDTO, OnlineBookingRequestDTO } from "application/dto/booking/book-trainer.dto.";
import { VerifyOnlinePaymentUsecase } from "application/usecases/payment/verify-digital-payment";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { I_PAYMENT_SERVICE_TOKEN, IPaymentService } from "domain/services/IPaymentService";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { IBookSessionWithTrainer } from "application/interfaces/booking/i-book-session-with-trainer.usecase";
import { BookingMapper } from "application/mappers/booking-mapper";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import config from "config";
import { BookingEntity } from "domain/entities/BookingEntity";

@injectable()
export class OnlineBookingUseCase
    extends VerifyOnlinePaymentUsecase
    implements IBookSessionWithTrainer {

    constructor(
        @inject(I_PAYMENT_SERVICE_TOKEN) paymentService: IPaymentService,
        @inject(I_BOOKING_REPO_TOKEN) private readonly _bookingRepository: IBookingRepo,
        @inject(I_WALLET_REPO_TOKEN) private readonly _walletRepository: IWalletRepo,
        @inject(I_NOTIFICATION_SERVICE_TOKEN) private readonly _notificationService: INotificationService,
        @inject(I_NOTIFICATION_REPO_TOKEN) private readonly _notificationRepository: INotificationRepo
    ) {
        super(paymentService);
    }

    async bookSessionWithTrainer(
        input: OnlineBookingRequestDTO
    ): Promise<BookingSummaryDTO> {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            ...bookingData
        } = input;

        await super.execute({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        const bookingDate = new Date(bookingData.date);

        const isAlreadyBooked = await this._bookingRepository.checkAvailability(
            bookingData.trainerId,
            bookingDate,
            bookingData.time
        );


        if (isAlreadyBooked) {
            throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
        }

        const bookingEntity = BookingMapper.toBookingEntity(bookingData);

        await this._bookingRepository.createBooking(bookingEntity);
        const bookingDetails = await this._bookingRepository.findBookingDetails(bookingEntity.bookingId)

        if (!bookingDetails) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        await Promise.all([
            this._walletRepository.holdAmount(
                bookingEntity.trainerId,
                bookingEntity.bookingId,
                bookingEntity.trainerEarning
            ),
            this._walletRepository.holdAmount(
                config.ADMIN,
                bookingEntity.bookingId,
                bookingEntity.adminCommission
            )
        ]);

        await this._dispatchSuccessNotifications(
            bookingData.userId,
            bookingEntity
        );

        return BookingMapper.toBookingSummary(bookingDetails);
    }

    private async _dispatchSuccessNotifications(
        userId: string,
        booking: BookingEntity
    ): Promise<void> {

        const userNotif = NotificationMapper.toCreateEntity({
            message: `Payment successful! Your trainer will confirm shortly.`,
            title: "Booking Initiated",
            recipientId: userId,
            senderId: "SYSTEM_SECURITY"
        });

        const trainerNotif = NotificationMapper.toCreateEntity({
            message: `You have a new booking request.`,
            title: "New Booking",
            recipientId: booking.trainerId,
            senderId: "SYSTEM_SECURITY"
        });

        await Promise.all([
            this._notificationRepository.addNotification(userNotif),
            this._notificationRepository.addNotification(trainerNotif)
        ]);

        await Promise.all([
            this._notificationService.notifyUser(
                userId,
                NotificationMapper.toResponseDTO(userNotif)
            ),
            this._notificationService.notifyUser(
                booking.trainerId,
                NotificationMapper.toResponseDTO(trainerNotif)
            )
        ]);
    }
}