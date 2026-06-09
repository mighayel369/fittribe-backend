import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_INITIATE_ONLINE_PAYMENT_TOKEN, IInitiateOnlinePayment } from 'application/interfaces/payment/i-initiate-online-payment.usecase';
import { I_VERIFY_ONLINE_PAYMENT_TOKEN, IVeirfyOnlinePayment } from 'application/interfaces/payment/i-verify-online-payment.usecase';
import { CreateOnlinePaymentRequestDTO } from 'application/dto/payment/create-online-payment.dto';
import { VerifyPaymentRequestDTO } from 'application/dto/payment/online-payment.dto';
@injectable()
export class UserPaymentController {
    constructor(
        @inject(I_INITIATE_ONLINE_PAYMENT_TOKEN) private _initiatePayment: IInitiateOnlinePayment,
        @inject(I_VERIFY_ONLINE_PAYMENT_TOKEN) private _verifyPayment: IVeirfyOnlinePayment
    ) { }

    initiateOnlinePayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input = req.body as CreateOnlinePaymentRequestDTO;

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
            const input =   req.body as VerifyPaymentRequestDTO

            await this._verifyPayment.execute(
                input
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message:
                    SUCCESS_MESSAGES.PAYMENT.PAYMENT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    };
}