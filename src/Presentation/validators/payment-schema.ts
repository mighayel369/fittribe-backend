import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  trainerId: z.string("Invalid Trainer ID"),
  programId: z.string("Invalid Program ID"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  amount: z.coerce.number()
    .positive("Amount must be greater than zero")
    .min(1, "Minimum payment amount is 1"),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
  trainerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Trainer ID"),
  programId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Program ID"),
  slotId: z.string().optional(),
});