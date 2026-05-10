import { PaymentOrder } from "./types/payment";

export const I_PAYMENT_SERVICE_TOKEN = Symbol("I_PAYMENT_SERVICE_TOKEN");
export interface IPaymentService {
  createOrder(amount: number): Promise<PaymentOrder>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}