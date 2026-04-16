
export const I_PAYMENT_SERVICE_TOKEN = Symbol("I_PAYMENT_SERVICE_TOKEN");
export interface IPaymentService {
  createOrder(amount: number): Promise<any>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}