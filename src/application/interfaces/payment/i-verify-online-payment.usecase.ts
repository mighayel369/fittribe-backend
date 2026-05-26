import { VerifyPaymentRequestDTO } from "application/dto/payment/online-payment.dto";
export const I_VERIFY_ONLINE_PAYMENT_TOKEN = Symbol("I_VERIFY_ONLINE_PAYMENT_TOKEN");

export interface IVeirfyOnlinePayment {
    execute(input: VerifyPaymentRequestDTO): Promise<boolean>
}