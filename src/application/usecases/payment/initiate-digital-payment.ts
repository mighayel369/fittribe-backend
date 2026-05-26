import { inject, injectable } from "tsyringe";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { I_PAYMENT_SERVICE_TOKEN, IPaymentService } from "domain/services/IPaymentService";
import { OnlinePaymentOrderResponseDTO, OnlinePaymentOrderResponseSchema } from "application/dto/payment/online-payment.dto";
import { IInitiateOnlinePayment } from "application/interfaces/payment/i-initiate-online-payment.usecase";
import { CreateOnlinePaymentRequestDTO } from "application/dto/payment/create-online-payment.dto";
import { PaymentMapper } from "application/mappers/payment-mapper";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class InitiateOnlinePaymentUseCase implements IInitiateOnlinePayment {

  constructor(
    @inject(I_PAYMENT_SERVICE_TOKEN)
    private readonly _paymentService: IPaymentService,

    @inject(I_BOOKING_REPO_TOKEN)
    private readonly _bookingRepository: IBookingRepo
  ) { }

  async execute(paymentData: CreateOnlinePaymentRequestDTO): Promise<OnlinePaymentOrderResponseDTO> {

    const { trainerId, date, time, amount } = paymentData;

    const isAlreadyBooked = await this._bookingRepository.checkAvailability(
      trainerId,
      date,
      time
    );

    if (isAlreadyBooked) {
      throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT
      );
    }

    const order = await this._paymentService.createOrder(amount);

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_CREATION_FAILED, HttpStatus.BAD_REQUEST);
    }

    return OnlinePaymentOrderResponseSchema.parse(
      PaymentMapper.toOnlineOrderResponseDTO(order)
    );
  }
}