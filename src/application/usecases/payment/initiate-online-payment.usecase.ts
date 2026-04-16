import { inject, injectable } from "tsyringe";
import { I_BOOKING_REPO_TOKEN, IBookingRepo } from "domain/repositories/IBookingRepo";
import { I_PAYMENT_SERVICE_TOKEN, IPaymentService } from "domain/services/IPaymentService";
import { CreateOnlinePaymentRequestDTO, OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";
import { AppError } from "domain/errors/AppError";

import { IInitiateOnlinePayment } from "application/interfaces/payment/i-initiate-online-payment.usecase";
import { PaymentMapper } from "application/mappers/payment-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { timeToMin } from "utils/generateTimeSlots";
@injectable()
export class InitiateOnlinePaymentUseCase implements IInitiateOnlinePayment{
  constructor(
    @inject(I_PAYMENT_SERVICE_TOKEN) private _paymentService: IPaymentService,
    @inject(I_BOOKING_REPO_TOKEN) private _bookingRepo: IBookingRepo
  ) {}

  async execute(data: CreateOnlinePaymentRequestDTO): Promise<OnlinePaymentOrderResponseDTO> {

    const isBooked = await this._bookingRepo.checkAvailability(
      data.trainerId, 
      new Date(data.date), 
      timeToMin(data.time)
    );

    if (isBooked) {
      throw new AppError(ERROR_MESSAGES.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
    }

    
    


    const order = await this._paymentService.createOrder(data.amount);
    if(!order){
      throw new AppError(ERROR_MESSAGES.ORDER_CREATION_FAILED,HttpStatus.BAD_REQUEST)
    }
   return PaymentMapper.toOnlineOrderResponseDTO(order)
  }
}