import { OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";
import { CreateOnlinePaymentRequestDTO } from "application/dto/payment/create-online-payment.dto";
export const I_INITIATE_ONLINE_PAYMENT_TOKEN = Symbol("I_INITIATE_ONLINE_PAYMENT_TOKEN");

export interface IInitiateOnlinePayment {
    execute(input: CreateOnlinePaymentRequestDTO): Promise<OnlinePaymentOrderResponseDTO>
}