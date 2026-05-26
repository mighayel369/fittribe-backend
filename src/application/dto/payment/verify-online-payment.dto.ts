import { z } from "zod";

export const VerifyOnlinePaymentSchema =
  z.object({
    razorpay_order_id: z
      .string()
      .trim()
      .min(1),
    razorpay_payment_id: z
      .string()
      .trim()
      .min(1),
    razorpay_signature: z
      .string()
      .trim()
      .min(1)
  });

export type VerifyOnlinePaymentDTO =
  z.infer<typeof VerifyOnlinePaymentSchema>;