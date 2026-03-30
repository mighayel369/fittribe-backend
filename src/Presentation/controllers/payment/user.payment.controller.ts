import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IInitiateOnlinePayment } from 'application/interfaces/payment/i-initiate-online-payment.usecase';
import { CreateOnlinePaymentRequestDTO, OnlinePaymentOrderResponseDTO } from 'application/dto/payment/online-payment.dto';
import { IVeirfyOnlinePayment } from 'application/interfaces/payment/i-verify-online-payment.usecase';
import { VerifyOnlinePaymentRequestDTO } from 'application/dto/payment/verify-online-payment.dto';

@injectable()
export class UserPaymentController {
  constructor(
    @inject("ICreateOrderUseCase") private _initiatePayment: IInitiateOnlinePayment,
    @inject("IVerifyPaymentUseCase") private _verifyPayment: IVeirfyOnlinePayment
  ) {}

initiateOnlinePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: CreateOnlinePaymentRequestDTO = { ...req.body };

        const orderData = await this._initiatePayment.execute(input);

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: SUCCESS_MESSAGES.PAYMENT.PAYMENT_REQUEST_INITIATED,
            ...orderData
        });
    } catch (error) {
        next(error);
    }
};

verifyOnlinePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: VerifyOnlinePaymentRequestDTO = { ...req.body };

        await this._verifyPayment.execute(input);

        res.status(HttpStatus.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.PAYMENT.PAYMENT_SUCCESS
        });
    } catch (error) {
        next(error);
    }
};
}