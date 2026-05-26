import { z } from "zod";
import { VerifyOnlinePaymentSchema } from "./verify-online-payment.dto";
export const OnlinePaymentOrderResponseSchema =
  z.object({
    orderId: z.string(),
    amount: z.union([
      z.string(),
      z.number()
    ]),
    currency: z.string(),
    key: z.string()
  });

export const BookingDetailsSchema =
  z.object({

    trainerId: z.string().trim().min(1, "Trainer id is required"),
    program: z.string().trim().min(1, "Program id is required"),
    date: z.string().trim().min(1, "Booking date is required"),
    time: z.number({ error: "Time slot is required" }),
    price: z.number({ error: "Price is required" }).positive("Price must be greater than 0")
  });

export type OnlinePaymentOrderResponseDTO = z.infer<typeof OnlinePaymentOrderResponseSchema>;


export const VerifyPaymentRequestSchema =
  VerifyOnlinePaymentSchema.extend({
    bookingDetails: BookingDetailsSchema
  });

export type VerifyPaymentRequestDTO = z.infer<typeof VerifyPaymentRequestSchema>;