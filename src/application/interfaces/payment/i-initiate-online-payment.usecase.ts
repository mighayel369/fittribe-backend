import { CreateOnlinePaymentRequestDTO,OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";

export const I_INITIATE_ONLINE_PAYMENT_TOKEN = Symbol("I_INITIATE_ONLINE_PAYMENT_TOKEN");

export interface IInitiateOnlinePayment{
    execute(input:CreateOnlinePaymentRequestDTO):Promise<OnlinePaymentOrderResponseDTO>
}