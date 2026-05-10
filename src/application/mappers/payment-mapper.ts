import { PaymentOrder } from "domain/services/types/payment";
import { OnlinePaymentOrderResponseDTO } from "application/dto/payment/online-payment.dto";
import config from "config";
export class PaymentMapper {
  static toOnlineOrderResponseDTO(order: PaymentOrder): OnlinePaymentOrderResponseDTO {
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: config.RAZORPAY_ID!
    };
  }
}