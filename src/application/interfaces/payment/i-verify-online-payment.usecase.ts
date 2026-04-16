import { VerifyOnlinePaymentRequestDTO } from "application/dto/payment/verify-online-payment.dto"

export const I_VERIFY_ONLINE_PAYMENT_TOKEN = Symbol("I_VERIFY_ONLINE_PAYMENT_TOKEN");

export interface IVeirfyOnlinePayment{
    execute(input:VerifyOnlinePaymentRequestDTO):Promise<boolean>
}