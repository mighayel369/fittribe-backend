
import Razorpay from "razorpay";
import config from "config";
import crypto from "crypto";
import { injectable } from "tsyringe";
import { IPaymentService } from "domain/services/IPaymentService";
import { PaymentOrder } from "domain/services/types/payment";
@injectable()
export class PaymentService implements IPaymentService {
  private razorpay = new Razorpay({
    key_id: config.RAZORPAY_ID!,
    key_secret: config.RAZORPAY_SECRET!
  });

  async createOrder(amount: number): Promise<PaymentOrder> {
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = config.RAZORPAY_SECRET!;
    const hmac = crypto.createHmac("sha256", secret);

    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    return generated_signature === signature;
  }
}